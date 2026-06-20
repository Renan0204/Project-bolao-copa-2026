package br.com.bolao.copa.controller;

import br.com.bolao.copa.service.PartidaService;
import br.com.bolao.copa.service.SelecaoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    private final SelecaoService selecaoService;
    private final PartidaService partidaService;

    public DashboardController(SelecaoService selecaoService, PartidaService partidaService) {
        this.selecaoService = selecaoService;
        this.partidaService = partidaService;
    }

    @GetMapping("/")
    public String home() {
        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        int totalSelecoes = selecaoService.listarTodas().size();
        int totalPartidas = partidaService.listarTodas().size();

        long partidasFinalizadas = partidaService.listarTodas()
                .stream()
                .filter(partida -> "Finalizada".equals(partida.getStatus()))
                .count();

        long partidasPendentes = totalPartidas - partidasFinalizadas;

        model.addAttribute("totalSelecoes", totalSelecoes);
        model.addAttribute("totalPartidas", totalPartidas);
        model.addAttribute("partidasFinalizadas", partidasFinalizadas);
        model.addAttribute("partidasPendentes", partidasPendentes);

        return "dashboard/index";
    }
}