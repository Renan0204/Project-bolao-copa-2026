package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.service.EstadioService;
import br.com.bolao.copa.service.PartidaService;
import br.com.bolao.copa.service.SelecaoService;
import br.com.bolao.copa.service.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class DashboardController {

    private final SelecaoService selecaoService;
    private final PartidaService partidaService;
    private final EstadioService estadioService;
    private final UsuarioService usuarioService;

    public DashboardController(SelecaoService selecaoService,
                               PartidaService partidaService,
                               EstadioService estadioService,
                               UsuarioService usuarioService) {
        this.selecaoService = selecaoService;
        this.partidaService = partidaService;
        this.estadioService = estadioService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/")
    public String home() {
        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        List<Partida> partidas = partidaService.listarTodas();
        List<Usuario> usuarios = usuarioService.listar();

        int totalSelecoes = selecaoService.listarTodas().size();
        int totalEstadios = estadioService.listarTodos().size();
        int totalPartidas = partidas.size();
        int totalUsuarios = usuarios.size();

        long partidasAgendadas = partidas.stream()
                .filter(partida -> PartidaService.STATUS_AGENDADA.equalsIgnoreCase(partida.getStatus()))
                .count();

        long partidasEmAndamento = partidas.stream()
                .filter(partida -> PartidaService.STATUS_EM_ANDAMENTO.equalsIgnoreCase(partida.getStatus()))
                .count();

        long partidasFinalizadas = partidas.stream()
                .filter(partida -> PartidaService.STATUS_FINALIZADA.equalsIgnoreCase(partida.getStatus()))
                .count();

        long usuariosAtivos = usuarios.stream()
                .filter(usuario -> !Boolean.TRUE.equals(usuario.getBloqueado()))
                .count();

        long usuariosBloqueados = usuarios.stream()
                .filter(usuario -> Boolean.TRUE.equals(usuario.getBloqueado()))
                .count();

        model.addAttribute("totalSelecoes", totalSelecoes);
        model.addAttribute("totalEstadios", totalEstadios);
        model.addAttribute("totalPartidas", totalPartidas);
        model.addAttribute("totalUsuarios", totalUsuarios);

        model.addAttribute("partidasAgendadas", partidasAgendadas);
        model.addAttribute("partidasEmAndamento", partidasEmAndamento);
        model.addAttribute("partidasFinalizadas", partidasFinalizadas);

        model.addAttribute("usuariosAtivos", usuariosAtivos);
        model.addAttribute("usuariosBloqueados", usuariosBloqueados);

        model.addAttribute("partidas", partidas);

        return "dashboard/index";
    }
}