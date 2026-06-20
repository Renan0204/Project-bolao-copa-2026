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

        validarUsuario(usuario);
        validarDadosDoPalpite(dadosPalpite);
        validarPartidaParaPalpite(partida);

        Palpite palpiteExistente = palpiteRepository.findByUsuarioAndPartida(usuario, partida);

        if (palpiteExistente != null) {
            palpiteExistente.setGolsSelecaoA(dadosPalpite.getGolsSelecaoA());
            palpiteExistente.setGolsSelecaoB(dadosPalpite.getGolsSelecaoB());
            palpiteExistente.setPontos(0);
            palpiteExistente.setCriterioPontuacao("Aguardando resultado");
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

        validarUsuario(usuario);

        if (!palpite.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Você não pode editar um palpite de outro usuário.");
        }

        validarDadosDoPalpite(dadosPalpite);
        validarPartidaParaPalpite(palpite.getPartida());

        palpite.setGolsSelecaoA(dadosPalpite.getGolsSelecaoA());
        palpite.setGolsSelecaoB(dadosPalpite.getGolsSelecaoB());
        palpite.setPontos(0);
        palpite.setCriterioPontuacao("Aguardando resultado");
        palpite.setAtualizadoEm(LocalDateTime.now());

        return palpiteRepository.save(palpite);
    }

    public Palpite listar(Long id) {
        return palpiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Palpite não encontrado."));
    }

    public List<Palpite> listarMeusPalpites(Usuario usuario) {
        validarUsuario(usuario);

        return palpiteRepository.findByUsuarioOrderByCriadoEmDesc(usuario);
    }

    public List<Palpite> listarPorPartida(Partida partida) {
        return palpiteRepository.findByPartida(partida);
    }

    private void validarUsuario(Usuario usuario) {
        if (usuario == null || usuario.getId() == null) {
            throw new RuntimeException("Usuário inválido.");
        }

        if (Boolean.TRUE.equals(usuario.getBloqueado())) {
            throw new RuntimeException("Usuário bloqueado.");
        }
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

        if (!PartidaService.STATUS_AGENDADA.equalsIgnoreCase(partida.getStatus())) {
            throw new RuntimeException("Não é mais possível registrar ou editar palpites para essa partida.");
        }

        if (!LocalDateTime.now().isBefore(partida.getDataHora())) {
            throw new RuntimeException("Não é mais possível registrar ou editar palpites para essa partida.");
        }
    }
}