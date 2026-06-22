package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Palpite;
import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.repository.PalpiteRepository;
import br.com.bolao.copa.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PontuacaoService {

    @Autowired
    private PalpiteRepository palpiteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void recalcularPontuacaoDaPartida(Partida partida) {
        if (partida == null) {
            throw new RuntimeException("Partida não encontrada.");
        }

        if (partida.getGolsSelecaoA() == null || partida.getGolsSelecaoB() == null) {
            throw new RuntimeException("A partida ainda não possui resultado informado.");
        }

        List<Palpite> palpites = palpiteRepository.findByPartida(partida);

        for (Palpite palpite : palpites) {
            calcularPontuacaoDoPalpite(palpite, partida);
            palpiteRepository.save(palpite);
        }

        recalcularPontuacaoDosUsuarios();
    }

    public void calcularPontuacaoDoPalpite(Palpite palpite, Partida partida) {
        if (palpite == null || partida == null) {
            throw new RuntimeException("Palpite ou partida inválida.");
        }

        Integer golsPalpiteA = palpite.getGolsSelecaoA();
        Integer golsPalpiteB = palpite.getGolsSelecaoB();

        Integer golsRealA = partida.getGolsSelecaoA();
        Integer golsRealB = partida.getGolsSelecaoB();

        if (golsPalpiteA == null || golsPalpiteB == null) {
            palpite.setPontos(0);
            palpite.setCriterioPontuacao("Palpite incompleto");
            return;
        }

        if (golsRealA == null || golsRealB == null) {
            palpite.setPontos(0);
            palpite.setCriterioPontuacao("Aguardando resultado");
            return;
        }

        if (golsPalpiteA.equals(golsRealA) && golsPalpiteB.equals(golsRealB)) {
            palpite.setPontos(10);
            palpite.setCriterioPontuacao("Placar exato");
            return;
        }

        String resultadoPalpite = identificarResultado(golsPalpiteA, golsPalpiteB);
        String resultadoReal = identificarResultado(golsRealA, golsRealB);

        if (resultadoPalpite.equals(resultadoReal)) {
            palpite.setPontos(5);
            palpite.setCriterioPontuacao("Acertou vencedor ou empate");
            return;
        }

        palpite.setPontos(0);
        palpite.setCriterioPontuacao("Não pontuou");
    }

    public void recalcularPontuacaoDosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();

        for (Usuario usuario : usuarios) {
            List<Palpite> palpites = palpiteRepository.findByUsuarioOrderByCriadoEmDesc(usuario);

            int pontuacaoTotal = 0;
            int placaresExatos = 0;

            for (Palpite palpite : palpites) {
                if (palpite.getPontos() != null) {
                    pontuacaoTotal += palpite.getPontos();
                }

                if ("Placar exato".equalsIgnoreCase(palpite.getCriterioPontuacao())) {
                    placaresExatos++;
                }
            }

            usuario.setPontuacaoTotal(pontuacaoTotal);
            usuario.setPlacaresExatos(placaresExatos);

            usuarioRepository.save(usuario);
        }
    }

    private String identificarResultado(Integer golsA, Integer golsB) {
        if (golsA > golsB) {
            return "VITORIA_A";
        }

        if (golsB > golsA) {
            return "VITORIA_B";
        }

        return "EMPATE";
    }
}