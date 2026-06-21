package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.model.Selecao;
import br.com.bolao.copa.repository.PartidaRepository;
import br.com.bolao.copa.util.OpcoesAdmin;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PartidaService {

    public static final String STATUS_AGENDADA = "Agendada";
    public static final String STATUS_EM_ANDAMENTO = "Em andamento";
    public static final String STATUS_FINALIZADA = "Finalizada";

    private final PartidaRepository partidaRepository;
    private final PontuacaoService pontuacaoService;
    private final SelecaoService selecaoService;

    public PartidaService(PartidaRepository partidaRepository,
                          PontuacaoService pontuacaoService,
                          SelecaoService selecaoService) {
        this.partidaRepository = partidaRepository;
        this.pontuacaoService = pontuacaoService;
        this.selecaoService = selecaoService;
    }

    public List<Partida> listarTodas() {
        return partidaRepository.findAllByOrderByDataHoraAsc();
    }

    public Partida salvar(Partida partida) {
        validarPartidaParaCadastroOuEdicao(partida);

        if (partida.getId() == null) {
            partida.setStatus(STATUS_AGENDADA);
            partida.setGolsSelecaoA(null);
            partida.setGolsSelecaoB(null);
        } else {
            Partida partidaAtual = buscarPorId(partida.getId());

            if (partidaAtual == null) {
                throw new RuntimeException("Partida não encontrada.");
            }

            if (!STATUS_AGENDADA.equalsIgnoreCase(partidaAtual.getStatus())) {
                throw new RuntimeException("Somente partidas agendadas podem ser editadas.");
            }

            partida.setStatus(partidaAtual.getStatus());
            partida.setGolsSelecaoA(partidaAtual.getGolsSelecaoA());
            partida.setGolsSelecaoB(partidaAtual.getGolsSelecaoB());
        }

        return partidaRepository.save(partida);
    }

    public Partida buscarPorId(Long id) {
        return partidaRepository.findById(id).orElse(null);
    }

    public void excluir(Long id) {
        partidaRepository.deleteById(id);
    }

    @Transactional
    public Partida iniciarPartida(Long id) {
        Partida partida = buscarObrigatoria(id);

        if (!STATUS_AGENDADA.equalsIgnoreCase(partida.getStatus())) {
            throw new RuntimeException("Somente partidas agendadas podem ser iniciadas.");
        }

        if (partida.getDataHora() == null) {
            throw new RuntimeException("A partida não possui data e hora cadastrada.");
        }

        if (LocalDateTime.now().isBefore(partida.getDataHora())) {
            throw new RuntimeException("A partida só pode ser iniciada quando a data e hora cadastradas chegarem.");
        }

        partida.setStatus(STATUS_EM_ANDAMENTO);

        return partidaRepository.save(partida);
    }

    @Transactional
    public Partida lancarGols(Long id, Integer golsSelecaoA, Integer golsSelecaoB) {
        Partida partida = buscarObrigatoria(id);

        if (!STATUS_EM_ANDAMENTO.equalsIgnoreCase(partida.getStatus())) {
            throw new RuntimeException("Os gols só podem ser lançados em partida em andamento.");
        }

        validarGols(golsSelecaoA, golsSelecaoB);

        partida.setGolsSelecaoA(golsSelecaoA);
        partida.setGolsSelecaoB(golsSelecaoB);

        return partidaRepository.save(partida);
    }

    @Transactional
    public Partida finalizarPartida(Long id) {
        Partida partida = buscarObrigatoria(id);

        if (!STATUS_EM_ANDAMENTO.equalsIgnoreCase(partida.getStatus())) {
            throw new RuntimeException("Somente partidas em andamento podem ser finalizadas.");
        }

        if (partida.getGolsSelecaoA() == null || partida.getGolsSelecaoB() == null) {
            throw new RuntimeException("Informe os gols das duas seleções antes de finalizar a partida.");
        }

        partida.setStatus(STATUS_FINALIZADA);

        Partida partidaSalva = partidaRepository.save(partida);

        pontuacaoService.recalcularPontuacaoDaPartida(partidaSalva);

        return partidaSalva;
    }

    @Transactional
    public void lancarResultado(Long id, Integer golsSelecaoA, Integer golsSelecaoB) {
        lancarGols(id, golsSelecaoA, golsSelecaoB);
        finalizarPartida(id);
    }

    @Transactional
    public Partida corrigirResultado(Long id, Integer golsSelecaoA, Integer golsSelecaoB) {
        Partida partida = buscarObrigatoria(id);

        if (!STATUS_FINALIZADA.equalsIgnoreCase(partida.getStatus())) {
            throw new RuntimeException("Somente partidas finalizadas podem ter resultado corrigido.");
        }

        validarGols(golsSelecaoA, golsSelecaoB);

        partida.setGolsSelecaoA(golsSelecaoA);
        partida.setGolsSelecaoB(golsSelecaoB);

        Partida partidaSalva = partidaRepository.save(partida);

        pontuacaoService.recalcularPontuacaoDaPartida(partidaSalva);

        return partidaSalva;
    }

    private Partida buscarObrigatoria(Long id) {
        Partida partida = buscarPorId(id);

        if (partida == null) {
            throw new RuntimeException("Partida não encontrada.");
        }

        return partida;
    }

    private void validarPartidaParaCadastroOuEdicao(Partida partida) {
        if (partida == null) {
            throw new RuntimeException("Informe os dados da partida.");
        }

        if (!OpcoesAdmin.grupoValido(partida.getGrupo())) {
            throw new RuntimeException("Selecione um grupo válido para a partida.");
        }

        if (!OpcoesAdmin.faseValida(partida.getFase())) {
            throw new RuntimeException("Selecione uma fase válida para a partida.");
        }

        if (partida.getDataHora() == null) {
            throw new RuntimeException("Informe a data e a hora da partida.");
        }

        if (partida.getEstadio() == null || partida.getEstadio().getId() == null) {
            throw new RuntimeException("Selecione um estádio cadastrado.");
        }

        if (selecaoService.contarPorGrupo(partida.getGrupo()) < 2) {
            throw new RuntimeException("O grupo precisa ter pelo menos 2 seleções para criar partidas.");
        }

        validarSelecoesDaPartida(partida);
    }

    private void validarSelecoesDaPartida(Partida partida) {
        Selecao selecaoA = partida.getSelecaoA();
        Selecao selecaoB = partida.getSelecaoB();

        if (selecaoA == null || selecaoA.getId() == null || selecaoB == null || selecaoB.getId() == null) {
            throw new RuntimeException("Selecione as duas seleções da partida.");
        }

        if (selecaoA.getId().equals(selecaoB.getId())) {
            throw new RuntimeException("Seleção A e Seleção B não podem ser iguais.");
        }

        if (!partida.getGrupo().equals(selecaoA.getGrupo()) || !partida.getGrupo().equals(selecaoB.getGrupo())) {
            throw new RuntimeException("As duas seleções precisam pertencer ao grupo selecionado.");
        }
    }

    private void validarGols(Integer golsSelecaoA, Integer golsSelecaoB) {
        if (golsSelecaoA == null || golsSelecaoB == null) {
            throw new RuntimeException("Informe os gols das duas seleções.");
        }

        if (golsSelecaoA < 0 || golsSelecaoB < 0) {
            throw new RuntimeException("Os gols não podem ser negativos.");
        }
    }
}