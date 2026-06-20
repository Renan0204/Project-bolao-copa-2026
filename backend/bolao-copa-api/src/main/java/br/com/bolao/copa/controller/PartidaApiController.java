package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.service.PartidaService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/partidas")
@CrossOrigin(origins = "*")
public class PartidaApiController {

    private final PartidaService partidaService;

    public PartidaApiController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    @GetMapping
    public List<Map<String, Object>> listarPartidas() {
        List<Partida> partidas = partidaService.listarTodas();
        List<Map<String, Object>> resposta = new ArrayList<>();

        for (Partida partida : partidas) {
            resposta.add(montarPartida(partida));
        }

        return resposta;
    }

    @GetMapping("/{id}")
    public Map<String, Object> buscarPartida(@PathVariable Long id) {
        Partida partida = partidaService.buscarPorId(id);

        if (partida == null) {
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("erro", "Partida não encontrada.");
            return resposta;
        }

        return montarPartida(partida);
    }

    private Map<String, Object> montarPartida(Partida partida) {
        Map<String, Object> dados = new HashMap<>();

        dados.put("id", partida.getId());
        dados.put("dataHora", partida.getDataHora());
        dados.put("fase", partida.getFase());
        dados.put("estadio", partida.getEstadio());
        dados.put("grupo", partida.getGrupo());
        dados.put("status", partida.getStatus());
        dados.put("golsSelecaoA", partida.getGolsSelecaoA());
        dados.put("golsSelecaoB", partida.getGolsSelecaoB());

        if (partida.getSelecaoA() != null) {
            dados.put("selecaoA", partida.getSelecaoA().getNome());
        }

        if (partida.getSelecaoB() != null) {
            dados.put("selecaoB", partida.getSelecaoB().getNome());
        }

        return dados;
    }
}