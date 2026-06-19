package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

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

        String token = gerarTokenSimples(usuarioLogado);

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

    private String gerarTokenSimples(Usuario usuario) {
        return "TOKEN-" + usuario.getId() + "-" + System.currentTimeMillis();
    }
}