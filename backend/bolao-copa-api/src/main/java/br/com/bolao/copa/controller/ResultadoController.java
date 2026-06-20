package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.service.PartidaService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ResultadoController {

    private final PartidaService partidaService;

    public ResultadoController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    @GetMapping("/resultados/lancar/{id}")
    public String lancarResultado(@PathVariable Long id, Model model) {
        Partida partida = partidaService.buscarPorId(id);
        model.addAttribute("partida", partida);
        return "resultados/form";
    }

    @PostMapping("/resultados/salvar")
    public String salvarResultado(@RequestParam Long id,
                                  @RequestParam Integer golsSelecaoA,
                                  @RequestParam Integer golsSelecaoB) {
        partidaService.lancarResultado(id, golsSelecaoA, golsSelecaoB);
        return "redirect:/partidas";
    }
}