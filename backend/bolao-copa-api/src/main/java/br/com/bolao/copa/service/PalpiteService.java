package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Palpite;
import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.repository.PalpiteRepository;
import br.com.bolao.copa.repository.PartidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PalpiteService {

    @Autowired
    private PalpiteRepository palpiteRepository;

    @Autowired
    private PartidaRepository partidaRepository;

    public Palpite salvar(Usuario usuario, Long partidaId, Palpite dadosPalpite) {
        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada."));

        validarDadosDoPalpite(dadosPalpite);
        validarPartidaParaPalpite(partida);

        Palpite palpiteExistente = palpiteRepository.findByUsuarioAndPartida(usuario, partida);

        if (palpiteExistente != null) {
            palpiteExistente.setGolsSelecaoA(dadosPalpite.getGolsSelecaoA());
            palpiteExistente.setGolsSelecaoB(dadosPalpite.getGolsSelecaoB());
            palpiteExistente.setAtualizadoEm(LocalDateTime.now());

            return palpiteRepository.save(palpiteExistente);
        }

        Palpite novoPalpite = new Palpite();
        novoPalpite.setUsuario(usuario);
        novoPalpite.setPartida(partida);
        novoPalpite.setGolsSelecaoA(dadosPalpite.getGolsSelecaoA());
        novoPalpite.setGolsSelecaoB(dadosPalpite.getGolsSelecaoB());
        novoPalpite.setPontos(0);
        novoPalpite.setCriterioPontuacao("Aguardando resultado");
        novoPalpite.setCriadoEm(LocalDateTime.now());

        return palpiteRepository.save(novoPalpite);
    }

    public Palpite editar(Usuario usuario, Long palpiteId, Palpite dadosPalpite) {
        Palpite palpite = listar(palpiteId);

        if (!palpite.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Você não pode editar um palpite de outro usuário.");
        }

        validarDadosDoPalpite(dadosPalpite);
        validarPartidaParaPalpite(palpite.getPartida());

        palpite.setGolsSelecaoA(dadosPalpite.getGolsSelecaoA());
        palpite.setGolsSelecaoB(dadosPalpite.getGolsSelecaoB());
        palpite.setAtualizadoEm(LocalDateTime.now());

        return palpiteRepository.save(palpite);
    }

    public Palpite listar(Long id) {
        return palpiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Palpite não encontrado."));
    }

    public List<Palpite> listarMeusPalpites(Usuario usuario) {
        return palpiteRepository.findByUsuarioOrderByCriadoEmDesc(usuario);
    }

    public List<Palpite> listarPorPartida(Partida partida) {
        return palpiteRepository.findByPartida(partida);
    }

    private void validarDadosDoPalpite(Palpite dadosPalpite) {
        if (dadosPalpite == null) {
            throw new RuntimeException("Informe os dados do palpite.");
        }

        if (dadosPalpite.getGolsSelecaoA() == null || dadosPalpite.getGolsSelecaoB() == null) {
            throw new RuntimeException("Informe os gols das duas seleções.");
        }

        if (dadosPalpite.getGolsSelecaoA() < 0 || dadosPalpite.getGolsSelecaoB() < 0) {
            throw new RuntimeException("Os gols do palpite não podem ser negativos.");
        }
    }

    private void validarPartidaParaPalpite(Partida partida) {
        if (partida == null) {
            throw new RuntimeException("Partida não encontrada.");
        }

        if (partida.getDataHora() == null) {
            throw new RuntimeException("A partida não possui data e hora cadastrada.");
        }

        if ("Em andamento".equalsIgnoreCase(partida.getStatus())) {
            throw new RuntimeException("Não é possível registrar ou editar palpite em uma partida em andamento.");
        }

        if ("Finalizada".equalsIgnoreCase(partida.getStatus())) {
            throw new RuntimeException("Não é possível registrar ou editar palpite em uma partida finalizada.");
        }

        if (!LocalDateTime.now().isBefore(partida.getDataHora())) {
            throw new RuntimeException("Não é possível registrar ou editar palpite após o início da partida.");
        }
    }
}