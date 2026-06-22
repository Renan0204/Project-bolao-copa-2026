package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.service.EmailService;
import br.com.bolao.copa.service.TokenService;
import br.com.bolao.copa.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmailService emailService;

    @Value("${app.redefinicao-senha-url.mobile:maozinhabet://redefinir-senha}")
    private String urlRedefinicaoSenha;

    @PostMapping("/cadastrar")
    public ResponseEntity<Map<String, Object>> cadastrar(@RequestBody Usuario usuario) {
        Map<String, Object> resposta = new HashMap<>();

        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            resposta.put("erro", "O nome é obrigatório.");
            return ResponseEntity.badRequest().body(resposta);
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            resposta.put("erro", "O e-mail é obrigatório.");
            return ResponseEntity.badRequest().body(resposta);
        }

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            resposta.put("erro", "A senha é obrigatória.");
            return ResponseEntity.badRequest().body(resposta);
        }

        try {
            Usuario usuarioSalvo = usuarioService.salvar(usuario);

            resposta.put("mensagem", "Usuário cadastrado com sucesso.");
            resposta.put("id", usuarioSalvo.getId());
            resposta.put("nome", usuarioSalvo.getNome());
            resposta.put("email", usuarioSalvo.getEmail());
            resposta.put("tipo", usuarioSalvo.getTipo());

            return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
        } catch (RuntimeException erro) {
            resposta.put("erro", erro.getMessage());
            return ResponseEntity.badRequest().body(resposta);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Usuario usuario) {
        Map<String, Object> resposta = new HashMap<>();

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            resposta.put("erro", "O e-mail é obrigatório.");
            return ResponseEntity.badRequest().body(resposta);
        }

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            resposta.put("erro", "A senha é obrigatória.");
            return ResponseEntity.badRequest().body(resposta);
        }

        Usuario usuarioLogado = usuarioService.autenticar(usuario.getEmail(), usuario.getSenha());

        if (usuarioLogado == null) {
            resposta.put("erro", "E-mail ou senha inválidos.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        String token = tokenService.gerarToken(usuarioLogado);

        Map<String, Object> dadosUsuario = new HashMap<>();
        dadosUsuario.put("id", usuarioLogado.getId());
        dadosUsuario.put("nome", usuarioLogado.getNome());
        dadosUsuario.put("email", usuarioLogado.getEmail());
        dadosUsuario.put("tipo", usuarioLogado.getTipo());
        dadosUsuario.put("pontuacaoTotal", usuarioLogado.getPontuacaoTotal());
        dadosUsuario.put("placaresExatos", usuarioLogado.getPlacaresExatos());

        resposta.put("mensagem", "Login realizado com sucesso.");
        resposta.put("token", token);
        resposta.put("tipoToken", "Bearer");
        resposta.put("usuario", dadosUsuario);

        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<Map<String, Object>> recuperarSenha(@RequestBody Map<String, String> dados) {
        Map<String, Object> resposta = new HashMap<>();

        String email = dados.get("email");

        if (email == null || email.isBlank()) {
            resposta.put("erro", "O e-mail é obrigatório.");
            return ResponseEntity.badRequest().body(resposta);
        }

        try {
            Usuario usuario = usuarioService.solicitarRecuperacaoSenha(email);

            resposta.put("mensagem", "Se o e-mail estiver cadastrado, um link de recuperação será enviado.");

            if (usuario != null) {
                String linkRecuperacao = montarLinkRecuperacao(usuario.getTokenRecuperacaoSenha());

                emailService.enviarRecuperacaoSenha(
                        usuario.getEmail(),
                        usuario.getNome(),
                        linkRecuperacao
                );
            }

            return ResponseEntity.ok(resposta);
        } catch (MailException erro) {
            resposta.put("erro", "Token gerado, mas não foi possível enviar o e-mail. Verifique as configurações SMTP.");
            resposta.put("detalhe", erro.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resposta);
        } catch (RuntimeException erro) {
            resposta.put("erro", erro.getMessage());

            return ResponseEntity.badRequest().body(resposta);
        }
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Map<String, Object>> redefinirSenha(@RequestBody Map<String, String> dados) {
        Map<String, Object> resposta = new HashMap<>();

        String token = dados.get("token");
        String novaSenha = dados.get("novaSenha");

        try {
            usuarioService.redefinirSenha(token, novaSenha);

            resposta.put("mensagem", "Senha redefinida com sucesso.");

            return ResponseEntity.ok(resposta);
        } catch (RuntimeException erro) {
            resposta.put("erro", erro.getMessage());

            return ResponseEntity.badRequest().body(resposta);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Map<String, Object> resposta = new HashMap<>();

        resposta.put("mensagem", "Logout realizado com sucesso. Remova o token armazenado no aplicativo.");

        return ResponseEntity.ok(resposta);
    }

    private String montarLinkRecuperacao(String token) {
        String tokenCodificado = URLEncoder.encode(token, StandardCharsets.UTF_8);

        return urlRedefinicaoSenha + "?token=" + tokenCodificado;
    }
}