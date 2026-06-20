package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.model.Selecao;
import br.com.bolao.copa.service.PartidaService;
import br.com.bolao.copa.service.SelecaoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PartidaController {

    private final PartidaService partidaService;
    private final SelecaoService selecaoService;

    public PartidaController(PartidaService partidaService, SelecaoService selecaoService) {
        this.partidaService = partidaService;
        this.selecaoService = selecaoService;
    }

    @GetMapping("/partidas")
    public String listarPartidas(Model model) {
        model.addAttribute("partidas", partidaService.listarTodas());
        return "partidas/lista";
    }

    @GetMapping("/partidas/novo")
    public String novaPartida(Model model) {
        model.addAttribute("partida", new Partida());
        model.addAttribute("selecoes", selecaoService.listarTodas());
        return "partidas/form";
    }

    @PostMapping("/partidas/salvar")
    public String salvarPartida(Partida partida,
                                @RequestParam Long selecaoAId,
                                @RequestParam Long selecaoBId) {

        Selecao selecaoA = selecaoService.buscarPorId(selecaoAId);
        Selecao selecaoB = selecaoService.buscarPorId(selecaoBId);

        partida.setSelecaoA(selecaoA);
        partida.setSelecaoB(selecaoB);

        partidaService.salvar(partida);

        return "redirect:/partidas";
    }

    @GetMapping("/partidas/editar/{id}")
    public String editarPartida(@PathVariable Long id, Model model) {
        Partida partida = partidaService.buscarPorId(id);

        model.addAttribute("partida", partida);
        model.addAttribute("selecoes", selecaoService.listarTodas());

        return "partidas/form";
    }

    @GetMapping("/partidas/excluir/{id}")
    public String excluirPartida(@PathVariable Long id) {
        partidaService.excluir(id);
        return "redirect:/partidas";
    }
}