package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.repository.PartidaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartidaService {

    private final PartidaRepository partidaRepository;

    public PartidaService(PartidaRepository partidaRepository) {
        this.partidaRepository = partidaRepository;
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

    public void lancarResultado(Long id, Integer golsSelecaoA, Integer golsSelecaoB) {
        Partida partida = buscarPorId(id);

        if (partida != null) {
            partida.setGolsSelecaoA(golsSelecaoA);
            partida.setGolsSelecaoB(golsSelecaoB);
            partida.setStatus("Finalizada");

            partidaRepository.save(partida);
        }
    }
}