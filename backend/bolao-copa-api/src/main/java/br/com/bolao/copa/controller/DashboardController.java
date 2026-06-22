package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.service.PalpiteService;
import br.com.bolao.copa.service.PartidaService;
import br.com.bolao.copa.service.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class DashboardController {

    private final PartidaService partidaService;
    private final UsuarioService usuarioService;
    private final PalpiteService palpiteService;

    public DashboardController(PartidaService partidaService,
                               UsuarioService usuarioService,
                               PalpiteService palpiteService) {
        this.partidaService = partidaService;
        this.usuarioService = usuarioService;
        this.palpiteService = palpiteService;
    }

    @GetMapping("/")
    public String home() {
        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        List<Partida> partidas = partidaService.listarTodas();
        List<Usuario> usuarios = usuarioService.listar();

        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime limiteUltimas24h = agora.minusHours(24);

        int totalUsuarios = usuarios.size();
        int totalPalpites = palpiteService.listarTodos().size();

        long partidasPendentesResultado = partidas.stream()
                .filter(partida -> !PartidaService.STATUS_FINALIZADA.equalsIgnoreCase(partida.getStatus()))
                .filter(partida -> partida.getDataHora() != null)
                .filter(partida -> !partida.getDataHora().isAfter(agora))
                .count();

        long usuariosAtivosUltimas24h = usuarios.stream()
                .filter(usuario -> usuario.getUltimoAcessoEm() != null)
                .filter(usuario -> usuario.getUltimoAcessoEm().isAfter(limiteUltimas24h))
                .count();

        model.addAttribute("totalUsuarios", totalUsuarios);
        model.addAttribute("totalPalpites", totalPalpites);
        model.addAttribute("partidasPendentesResultado", partidasPendentesResultado);
        model.addAttribute("usuariosAtivosUltimas24h", usuariosAtivosUltimas24h);

        return "dashboard/index";
    }
}