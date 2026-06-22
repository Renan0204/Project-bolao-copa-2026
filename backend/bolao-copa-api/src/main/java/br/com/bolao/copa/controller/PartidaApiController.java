package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.service.PartidaService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
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
    public List<Map<String, Object>> listarPartidas(@RequestParam(required = false) String fase,
                                                    @RequestParam(required = false) String status,
                                                    @RequestParam(required = false) String data) {
        List<Partida> partidas = partidaService.listarTodas();

        partidas = filtrarPartidas(partidas, fase, status, data);

        List<Map<String, Object>> resposta = new ArrayList<>();

        for (Partida partida : partidas) {
            resposta.add(montarPartida(partida));
        }

        return resposta;
    }

    @GetMapping("/proximas")
    public List<Map<String, Object>> listarProximasPartidas() {
        List<Partida> partidas = partidaService.listarTodas();
        List<Map<String, Object>> resposta = new ArrayList<>();

        for (Partida partida : partidas) {
            if (ehProximaPartida(partida)) {
                resposta.add(montarPartida(partida));
            }
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

    private List<Partida> filtrarPartidas(List<Partida> partidas,
                                          String fase,
                                          String status,
                                          String data) {
        List<Partida> partidasFiltradas = new ArrayList<>();

        for (Partida partida : partidas) {
            boolean passouNoFiltro = true;

            if (temTexto(fase) && !textoIgual(partida.getFase(), fase)) {
                passouNoFiltro = false;
            }

            if (temTexto(status) && !textoIgual(partida.getStatus(), status)) {
                passouNoFiltro = false;
            }

            if (temTexto(data) && !dataIgual(partida, data)) {
                passouNoFiltro = false;
            }

            if (passouNoFiltro) {
                partidasFiltradas.add(partida);
            }
        }

        return partidasFiltradas;
    }

    private boolean ehProximaPartida(Partida partida) {
        if (partida == null) {
            return false;
        }

        if (partida.getDataHora() == null) {
            return false;
        }

        if (!PartidaService.STATUS_AGENDADA.equalsIgnoreCase(partida.getStatus())) {
            return false;
        }

        return partida.getDataHora().isAfter(LocalDateTime.now());
    }

    private boolean dataIgual(Partida partida, String data) {
        if (partida == null || partida.getDataHora() == null) {
            return false;
        }

        try {
            LocalDate dataFiltro = LocalDate.parse(data);
            LocalDate dataPartida = partida.getDataHora().toLocalDate();

            return dataPartida.equals(dataFiltro);
        } catch (DateTimeParseException erro) {
            return false;
        }
    }

    private boolean textoIgual(String valorPartida, String valorFiltro) {
        if (valorPartida == null || valorFiltro == null) {
            return false;
        }

        return valorPartida.trim().equalsIgnoreCase(valorFiltro.trim());
    }

    private boolean temTexto(String valor) {
        return valor != null && !valor.isBlank();
    }

    private Map<String, Object> montarPartida(Partida partida) {
        Map<String, Object> dados = new HashMap<>();

        dados.put("id", partida.getId());
        dados.put("dataHora", partida.getDataHora());
        dados.put("fase", partida.getFase());
        dados.put("estadio", partida.getEstadio() != null ? partida.getEstadio().getNome() : null);
        dados.put("grupo", partida.getGrupo());
        dados.put("status", partida.getStatus());
        dados.put("golsSelecaoA", partida.getGolsSelecaoA());
        dados.put("golsSelecaoB", partida.getGolsSelecaoB());

        if (partida.getSelecaoA() != null) {
            dados.put("selecaoA", partida.getSelecaoA().getNome());
            dados.put("selecaoAId", partida.getSelecaoA().getId());
            dados.put("selecaoACodigoFifa", partida.getSelecaoA().getCodigoFifa());
            dados.put("selecaoABandeiraUrl", partida.getSelecaoA().getBandeiraUrl());
        } else {
            dados.put("selecaoA", null);
            dados.put("selecaoAId", null);
            dados.put("selecaoACodigoFifa", null);
            dados.put("selecaoABandeiraUrl", null);
        }

        if (partida.getSelecaoB() != null) {
            dados.put("selecaoB", partida.getSelecaoB().getNome());
            dados.put("selecaoBId", partida.getSelecaoB().getId());
            dados.put("selecaoBCodigoFifa", partida.getSelecaoB().getCodigoFifa());
            dados.put("selecaoBBandeiraUrl", partida.getSelecaoB().getBandeiraUrl());
        } else {
            dados.put("selecaoB", null);
            dados.put("selecaoBId", null);
            dados.put("selecaoBCodigoFifa", null);
            dados.put("selecaoBBandeiraUrl", null);
        }

        return dados;
    }
}