package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class UsuarioAdminController {

    private final UsuarioService usuarioService;

    public UsuarioAdminController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuarios-admin")
    public String listarUsuarios(@RequestParam(required = false) String termo,
                                 Model model) {
        model.addAttribute("usuarios", usuarioService.listarPorTermo(termo));
        model.addAttribute("termo", termo);

        return "usuarios/lista";
    }

    @GetMapping("/usuarios-admin/{id}")
    public String detalhesUsuario(@PathVariable Long id,
                                  Model model,
                                  RedirectAttributes redirectAttributes) {
        try {
            Usuario usuario = usuarioService.listar(id);

            model.addAttribute("usuario", usuario);

            return "usuarios/detalhe";
        } catch (RuntimeException erro) {
            redirectAttributes.addFlashAttribute("erro", "Usuário não encontrado.");
            return "redirect:/usuarios-admin";
        }
    }

    @GetMapping("/usuarios-admin/bloquear/{id}")
    public String bloquearDesbloquear(@PathVariable Long id,
                                      HttpSession session,
                                      RedirectAttributes redirectAttributes) {
        try {
            Usuario adminLogado = (Usuario) session.getAttribute(AdminLoginController.ADMIN_LOGADO);

            if (adminLogado != null && adminLogado.getId().equals(id)) {
                redirectAttributes.addFlashAttribute("erro", "Você não pode bloquear o próprio usuário administrador.");
                return "redirect:/usuarios-admin";
            }

            Usuario usuario = usuarioService.bloquearDesbloquear(id);

            if (Boolean.TRUE.equals(usuario.getBloqueado())) {
                redirectAttributes.addFlashAttribute("sucesso", "Usuário bloqueado com sucesso.");
            } else {
                redirectAttributes.addFlashAttribute("sucesso", "Usuário desbloqueado com sucesso.");
            }

        } catch (RuntimeException erro) {
            redirectAttributes.addFlashAttribute("erro", "Não foi possível alterar o status do usuário.");
        }

        return "redirect:/usuarios-admin";
    }
}