package br.com.bolao.copa.controller;

import br.com.bolao.copa.service.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RedefinicaoSenhaController {

    private final UsuarioService usuarioService;

    public RedefinicaoSenhaController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/redefinir-senha")
    public String telaRedefinicaoSenha(@RequestParam String token,
                                       Model model) {
        model.addAttribute("token", token);

        return "auth/redefinir-senha";
    }

    @PostMapping("/redefinir-senha")
    public String redefinirSenha(@RequestParam String token,
                                 @RequestParam String novaSenha,
                                 @RequestParam String confirmarSenha,
                                 Model model) {
        model.addAttribute("token", token);

        if (novaSenha == null || novaSenha.isBlank()) {
            model.addAttribute("erro", "Informe a nova senha.");
            return "auth/redefinir-senha";
        }

        if (!novaSenha.equals(confirmarSenha)) {
            model.addAttribute("erro", "A confirmação de senha não confere.");
            return "auth/redefinir-senha";
        }

        try {
            usuarioService.redefinirSenha(token, novaSenha);

            model.addAttribute("sucesso", "Senha redefinida com sucesso. Você já pode fazer login no aplicativo.");

            return "auth/redefinir-senha-sucesso";
        } catch (RuntimeException erro) {
            model.addAttribute("erro", erro.getMessage());

            return "auth/redefinir-senha";
        }
    }
}