package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.repository.PartidaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final PontuacaoService pontuacaoService;

    public PartidaService(PartidaRepository partidaRepository, PontuacaoService pontuacaoService) {
        this.partidaRepository = partidaRepository;
        this.pontuacaoService = pontuacaoService;
    }

    public List<Partida> listarTodas() {
        return partidaRepository.findAll();
    }

    public void salvar(Partida partida) {
        partidaRepository.save(partida);
    }

    public Partida buscarPorId(Long id) {
        return partidaRepository.findById(id).orElse(null);
    }

    public void excluir(Long id) {
        partidaRepository.deleteById(id);
    }

    @Transactional
    public void lancarResultado(Long id, Integer golsSelecaoA, Integer golsSelecaoB) {
        Partida partida = buscarPorId(id);

        if (partida != null) {
            partida.setGolsSelecaoA(golsSelecaoA);
            partida.setGolsSelecaoB(golsSelecaoB);
            partida.setStatus("Finalizada");

            Partida partidaSalva = partidaRepository.save(partida);

            pontuacaoService.recalcularPontuacaoDaPartida(partidaSalva);
        }
    }
}