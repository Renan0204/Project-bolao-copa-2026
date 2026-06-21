package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AdminLoginController {

    public static final String ADMIN_LOGADO = "adminLogado";

    private final UsuarioService usuarioService;

    public AdminLoginController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/admin/login")
    public String telaLogin(HttpSession session) {
        Usuario adminLogado = (Usuario) session.getAttribute(ADMIN_LOGADO);

        if (adminLogado != null) {
            return "redirect:/dashboard";
        }

        return "admin/login";
    }

    @PostMapping("/admin/login")
    public String login(@RequestParam String email,
                        @RequestParam String senha,
                        HttpSession session,
                        RedirectAttributes redirectAttributes) {

        Usuario usuario = usuarioService.autenticar(email, senha);

        if (usuario == null) {
            redirectAttributes.addFlashAttribute("erro", "E-mail ou senha inválidos.");
            return "redirect:/admin/login";
        }

        if (!"ADMIN".equalsIgnoreCase(usuario.getTipo())) {
            redirectAttributes.addFlashAttribute("erro", "Usuário sem permissão de administrador.");
            return "redirect:/admin/login";
        }

        session.setAttribute(ADMIN_LOGADO, usuario);

        return "redirect:/dashboard";
    }

    @GetMapping("/admin/logout")
    public String logout(HttpSession session,
                         RedirectAttributes redirectAttributes) {
        session.invalidate();

        redirectAttributes.addFlashAttribute("sucesso", "Logout realizado com sucesso.");

        return "redirect:/admin/login";
    }
}