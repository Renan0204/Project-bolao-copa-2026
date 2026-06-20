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
import java.util.ArrayList;
import java.util.HashMap;
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
    public String listarPartidas(Model model) {
        model.addAttribute("partidas", partidaService.listarTodas());
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
    public List<Map<String, Object>> selecoesPorGrupo(@RequestParam String grupo) {
        List<Map<String, Object>> resposta = new ArrayList<>();

        for (Selecao selecao : selecaoService.listarPorGrupo(grupo)) {
            Map<String, Object> item = new HashMap<>();

            item.put("id", selecao.getId());
            item.put("nome", selecao.getNome());
            item.put("codigoFifa", selecao.getCodigoFifa());
            item.put("grupo", selecao.getGrupo());

            resposta.add(item);
        }

        return resposta;
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
    }
}