package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Estadio;
import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.model.Selecao;
import br.com.bolao.copa.service.EstadioService;
import br.com.bolao.copa.service.PartidaService;
import br.com.bolao.copa.service.SelecaoService;
import br.com.bolao.copa.util.OpcoesAdmin;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Controller
public class PartidaController {

    private final PartidaService partidaService;
    private final SelecaoService selecaoService;
    private final EstadioService estadioService;

    public PartidaController(PartidaService partidaService,
                             SelecaoService selecaoService,
                             EstadioService estadioService) {
        this.partidaService = partidaService;
        this.selecaoService = selecaoService;
        this.estadioService = estadioService;
    }

    @GetMapping("/partidas")
    public String listarPartidas(@RequestParam(required = false) String fase,
                                 @RequestParam(required = false) String status,
                                 @RequestParam(required = false) String data,
                                 Model model) {
        List<Partida> partidas = partidaService.listarTodas();
        List<Partida> partidasFiltradas = aplicarFiltros(partidas, fase, status, data);

        model.addAttribute("partidas", partidasFiltradas);
        model.addAttribute("partidasAgrupadas", agruparPorFaseEData(partidasFiltradas));

        model.addAttribute("fases", OpcoesAdmin.fases());
        model.addAttribute("statusList", List.of(
                PartidaService.STATUS_AGENDADA,
                PartidaService.STATUS_EM_ANDAMENTO,
                PartidaService.STATUS_FINALIZADA
        ));

        model.addAttribute("faseFiltro", fase);
        model.addAttribute("statusFiltro", status);
        model.addAttribute("dataFiltro", data);
        model.addAttribute("totalFiltrado", partidasFiltradas.size());

        return "partidas/lista";
    }

    @GetMapping("/partidas/novo")
    public String novaPartida(Model model) {
        Partida partida = new Partida();
        partida.setStatus(PartidaService.STATUS_AGENDADA);

        prepararFormulario(model, partida);

        return "partidas/form";
    }

    @PostMapping("/partidas/salvar")
    public String salvarPartida(Partida partida,
                                @RequestParam Long selecaoAId,
                                @RequestParam Long selecaoBId,
                                @RequestParam Long estadioId,
                                @RequestParam LocalDate dataPartida,
                                @RequestParam LocalTime horaPartida,
                                Model model,
                                RedirectAttributes redirectAttributes) {
        try {
            Selecao selecaoA = selecaoService.buscarPorId(selecaoAId);
            Selecao selecaoB = selecaoService.buscarPorId(selecaoBId);
            Estadio estadio = estadioService.buscarPorId(estadioId);

            partida.setSelecaoA(selecaoA);
            partida.setSelecaoB(selecaoB);
            partida.setEstadio(estadio);
            partida.setDataHora(LocalDateTime.of(dataPartida, horaPartida));

            partidaService.salvar(partida);

            redirectAttributes.addFlashAttribute("sucesso", "Partida salva com sucesso.");

            return "redirect:/partidas";
        } catch (RuntimeException erro) {
            prepararFormulario(model, partida);

            model.addAttribute("erro", erro.getMessage());
            model.addAttribute("selecaoAId", selecaoAId);
            model.addAttribute("selecaoBId", selecaoBId);
            model.addAttribute("estadioId", estadioId);
            model.addAttribute("dataPartida", dataPartida);
            model.addAttribute("horaPartida", horaPartida);

            return "partidas/form";
        }
    }

    @GetMapping("/partidas/editar/{id}")
    public String editarPartida(@PathVariable Long id,
                                Model model,
                                RedirectAttributes redirectAttributes) {
        Partida partida = partidaService.buscarPorId(id);

        if (partida == null) {
            redirectAttributes.addFlashAttribute("erro", "Partida não encontrada.");
            return "redirect:/partidas";
        }

        prepararFormulario(model, partida);

        return "partidas/form";
    }

    @GetMapping("/partidas/excluir/{id}")
    public String excluirPartida(@PathVariable Long id,
                                 RedirectAttributes redirectAttributes) {
        try {
            partidaService.excluir(id);
            redirectAttributes.addFlashAttribute("sucesso", "Partida excluída com sucesso.");
        } catch (RuntimeException erro) {
            redirectAttributes.addFlashAttribute("erro", "Não foi possível excluir a partida.");
        }

        return "redirect:/partidas";
    }

    @GetMapping("/partidas/iniciar/{id}")
    public String iniciarPartida(@PathVariable Long id,
                                 RedirectAttributes redirectAttributes) {
        try {
            partidaService.iniciarPartida(id);
            redirectAttributes.addFlashAttribute("sucesso", "Partida iniciada com sucesso.");
        } catch (RuntimeException erro) {
            redirectAttributes.addFlashAttribute("erro", erro.getMessage());
        }

        return "redirect:/partidas";
    }

    @GetMapping("/partidas/finalizar/{id}")
    public String finalizarPartida(@PathVariable Long id,
                                   RedirectAttributes redirectAttributes) {
        try {
            partidaService.finalizarPartida(id);
            redirectAttributes.addFlashAttribute("sucesso", "Partida finalizada e pontuação calculada com sucesso.");
        } catch (RuntimeException erro) {
            redirectAttributes.addFlashAttribute("erro", erro.getMessage());
        }

        return "redirect:/partidas";
    }

    @GetMapping("/partidas/selecoes-por-grupo")
    @ResponseBody
    public List<Map<String, Object>> selecoesPorGrupo(@RequestParam(required = false) String grupo,
                                                      @RequestParam(required = false) String fase) {
        List<Map<String, Object>> resposta = new ArrayList<>();
        List<Selecao> selecoes;

        boolean deveFiltrarPorGrupo = temTexto(grupo)
                && (!temTexto(fase) || ehFaseDeGrupos(fase));

        if (deveFiltrarPorGrupo) {
            selecoes = selecaoService.listarPorGrupo(grupo);
        } else {
            selecoes = selecaoService.listarTodas();
        }

        for (Selecao selecao : selecoes) {
            Map<String, Object> item = new HashMap<>();

            item.put("id", selecao.getId());
            item.put("nome", selecao.getNome());
            item.put("codigoFifa", selecao.getCodigoFifa());
            item.put("grupo", selecao.getGrupo());

            resposta.add(item);
        }

        return resposta;
    }

    private List<Partida> aplicarFiltros(List<Partida> partidas,
                                         String fase,
                                         String status,
                                         String data) {
        List<Partida> partidasFiltradas = new ArrayList<>();
        LocalDate dataFiltro = converterData(data);

        for (Partida partida : partidas) {
            boolean passouNoFiltro = true;

            if (temTexto(fase) && !textoIgual(partida.getFase(), fase)) {
                passouNoFiltro = false;
            }

            if (temTexto(status) && !textoIgual(partida.getStatus(), status)) {
                passouNoFiltro = false;
            }

            if (temTexto(data)) {
                if (dataFiltro == null || partida.getDataHora() == null) {
                    passouNoFiltro = false;
                } else if (!partida.getDataHora().toLocalDate().equals(dataFiltro)) {
                    passouNoFiltro = false;
                }
            }

            if (passouNoFiltro) {
                partidasFiltradas.add(partida);
            }
        }

        return partidasFiltradas;
    }

    private Map<String, Map<String, List<Partida>>> agruparPorFaseEData(List<Partida> partidas) {
        Map<String, Map<String, List<Partida>>> partidasAgrupadas = new LinkedHashMap<>();
        DateTimeFormatter formatoData = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        for (Partida partida : partidas) {
            String fase = temTexto(partida.getFase()) ? partida.getFase() : "Sem fase";
            String data = partida.getDataHora() != null
                    ? partida.getDataHora().toLocalDate().format(formatoData)
                    : "Sem data";

            partidasAgrupadas
                    .computeIfAbsent(fase, chave -> new LinkedHashMap<>())
                    .computeIfAbsent(data, chave -> new ArrayList<>())
                    .add(partida);
        }

        return partidasAgrupadas;
    }

    private LocalDate converterData(String data) {
        if (!temTexto(data)) {
            return null;
        }

        try {
            return LocalDate.parse(data);
        } catch (DateTimeParseException erro) {
            return null;
        }
    }

    private void prepararFormulario(Model model, Partida partida) {
        model.addAttribute("partida", partida);
        model.addAttribute("selecoes", selecaoService.listarTodas());
        model.addAttribute("estadios", estadioService.listarTodos());
        model.addAttribute("grupos", OpcoesAdmin.grupos());
        model.addAttribute("fases", OpcoesAdmin.fases());

        if (partida.getDataHora() != null) {
            model.addAttribute("dataPartida", partida.getDataHora().toLocalDate());
            model.addAttribute("horaPartida", partida.getDataHora().toLocalTime());
        }

        if (partida.getSelecaoA() != null) {
            model.addAttribute("selecaoAId", partida.getSelecaoA().getId());
        }

        if (partida.getSelecaoB() != null) {
            model.addAttribute("selecaoBId", partida.getSelecaoB().getId());
        }

        if (partida.getEstadio() != null) {
            model.addAttribute("estadioId", partida.getEstadio().getId());
        }
    }

    private boolean ehFaseDeGrupos(String fase) {
        return fase != null && fase.toLowerCase().contains("grupo");
    }

    private boolean textoIgual(String valor, String filtro) {
        if (valor == null || filtro == null) {
            return false;
        }

        return valor.trim().equalsIgnoreCase(filtro.trim());
    }

    private boolean temTexto(String valor) {
        return valor != null && !valor.isBlank();
    }
}