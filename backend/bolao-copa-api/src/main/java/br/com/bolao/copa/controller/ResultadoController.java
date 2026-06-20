package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.service.PartidaService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ResultadoController {

    private final PartidaService partidaService;

    public ResultadoController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    @GetMapping("/resultados/lancar/{id}")
    public String lancarResultado(@PathVariable Long id,
                                  Model model,
                                  RedirectAttributes redirectAttributes) {
        Partida partida = partidaService.buscarPorId(id);

        if (partida == null) {
            redirectAttributes.addFlashAttribute("erro", "Partida não encontrada.");
            return "redirect:/partidas";
        }

        if (!PartidaService.STATUS_EM_ANDAMENTO.equalsIgnoreCase(partida.getStatus())) {
            redirectAttributes.addFlashAttribute("erro", "Os gols só podem ser lançados em partida em andamento.");
            return "redirect:/partidas";
        }

        model.addAttribute("partida", partida);

        return "resultados/form";
    }

    @PostMapping("/resultados/salvar")
    public String salvarResultado(@RequestParam Long id,
                                  @RequestParam Integer golsSelecaoA,
                                  @RequestParam Integer golsSelecaoB,
                                  RedirectAttributes redirectAttributes) {
        try {
            partidaService.lancarGols(id, golsSelecaoA, golsSelecaoB);
            redirectAttributes.addFlashAttribute("sucesso", "Gols salvos com sucesso. Agora você pode finalizar a partida.");
        } catch (RuntimeException erro) {
            redirectAttributes.addFlashAttribute("erro", erro.getMessage());
        }

        return "redirect:/partidas";
    }
}