package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.service.EmailService;
import br.com.bolao.copa.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Controller
public class AdminLoginController {

    public static final String ADMIN_LOGADO = "adminLogado";

    private final UsuarioService usuarioService;
    private final EmailService emailService;

    @Value("${app.redefinicao-senha-url:http://localhost:8080/redefinir-senha}")
    private String urlRedefinicaoSenha;

    public AdminLoginController(UsuarioService usuarioService,
                                EmailService emailService) {
        this.usuarioService = usuarioService;
        this.emailService = emailService;
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

    @GetMapping("/admin/recuperar-senha")
    public String telaRecuperarSenha() {
        return "admin/recuperar-senha";
    }

    @PostMapping("/admin/recuperar-senha")
    public String recuperarSenha(@RequestParam String email,
                                 Model model) {

        if (email == null || email.isBlank()) {
            model.addAttribute("erro", "Informe o e-mail.");
            return "admin/recuperar-senha";
        }

        try {
            Usuario usuario = usuarioService.buscarPorEmail(email.trim());

            if (usuario != null && "ADMIN".equalsIgnoreCase(usuario.getTipo())) {
                Usuario usuarioComToken = usuarioService.solicitarRecuperacaoSenha(email.trim());

                String linkRecuperacao = montarLinkRecuperacao(usuarioComToken.getTokenRecuperacaoSenha());

                emailService.enviarRecuperacaoSenha(
                        usuarioComToken.getEmail(),
                        usuarioComToken.getNome(),
                        linkRecuperacao
                );
            }

            model.addAttribute("sucesso", "Se o e-mail informado estiver cadastrado como administrador, enviaremos um link de recuperação.");

            return "admin/recuperar-senha";
        } catch (MailException erro) {
            model.addAttribute("erro", "Não foi possível enviar o e-mail de recuperação. Verifique as configurações SMTP.");
            return "admin/recuperar-senha";
        } catch (RuntimeException erro) {
            model.addAttribute("erro", erro.getMessage());
            return "admin/recuperar-senha";
        }
    }

    @GetMapping("/admin/logout")
    public String logout(HttpSession session,
                         RedirectAttributes redirectAttributes) {
        session.invalidate();

        redirectAttributes.addFlashAttribute("sucesso", "Logout realizado com sucesso.");

        return "redirect:/admin/login";
    }

    private String montarLinkRecuperacao(String token) {
        String tokenCodificado = URLEncoder.encode(token, StandardCharsets.UTF_8);

        return urlRedefinicaoSenha + "?token=" + tokenCodificado;
    }
}