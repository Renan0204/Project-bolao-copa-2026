package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.service.TokenService;
import br.com.bolao.copa.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenService tokenService;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> meuPerfil(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        Map<String, Object> resposta = new HashMap<>();

        Usuario usuario = buscarUsuarioPeloToken(authorizationHeader);

        if (usuario == null) {
            resposta.put("erro", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        resposta.put("usuario", montarUsuarioSemSenha(usuario));

        return ResponseEntity.ok(resposta);
    }

    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> editarMeuPerfil(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Usuario dadosAtualizados
    ) {
        Map<String, Object> resposta = new HashMap<>();

        Usuario usuario = buscarUsuarioPeloToken(authorizationHeader);

        if (usuario == null) {
            resposta.put("erro", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        if (dadosAtualizados.getNome() != null && !dadosAtualizados.getNome().isBlank()) {
            usuario.setNome(dadosAtualizados.getNome());
        }

        if (dadosAtualizados.getAvatarUrl() != null) {
            usuario.setAvatarUrl(dadosAtualizados.getAvatarUrl());
        }

        Usuario usuarioSalvo = usuarioService.salvar(usuario);

        resposta.put("mensagem", "Perfil atualizado com sucesso.");
        resposta.put("usuario", montarUsuarioSemSenha(usuarioSalvo));

        return ResponseEntity.ok(resposta);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Map<String, Object>> excluirMinhaConta(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        Map<String, Object> resposta = new HashMap<>();

        Usuario usuario = buscarUsuarioPeloToken(authorizationHeader);

        if (usuario == null) {
            resposta.put("erro", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        usuarioService.remover(usuario.getId());

        resposta.put("mensagem", "Conta excluída com sucesso.");

        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> resposta = new HashMap<>();

        resposta.put("mensagem", "Logout realizado com sucesso.");

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> buscarUsuario(@PathVariable Long id) {
        Map<String, Object> resposta = new HashMap<>();

        try {
            Usuario usuario = usuarioService.listar(id);

            resposta.put("usuario", montarUsuarioSemSenha(usuario));

            return ResponseEntity.ok(resposta);
        } catch (RuntimeException erro) {
            resposta.put("erro", "Usuário não encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resposta);
        }
    }

    private Usuario buscarUsuarioPeloToken(String authorizationHeader) {
        String token = tokenService.extrairTokenDoHeader(authorizationHeader);

        if (token == null) {
            return null;
        }

        String email = tokenService.validarToken(token);

        if (email == null) {
            return null;
        }

        return usuarioService.buscarPorEmail(email);
    }

    private Map<String, Object> montarUsuarioSemSenha(Usuario usuario) {
        Map<String, Object> dadosUsuario = new HashMap<>();

        dadosUsuario.put("id", usuario.getId());
        dadosUsuario.put("nome", usuario.getNome());
        dadosUsuario.put("email", usuario.getEmail());
        dadosUsuario.put("tipo", usuario.getTipo());
        dadosUsuario.put("avatarUrl", usuario.getAvatarUrl());
        dadosUsuario.put("pontuacaoTotal", usuario.getPontuacaoTotal());
        dadosUsuario.put("placaresExatos", usuario.getPlacaresExatos());
        dadosUsuario.put("bloqueado", usuario.getBloqueado());
        dadosUsuario.put("criadoEm", usuario.getCriadoEm());
        dadosUsuario.put("ultimoAcessoEm", usuario.getUltimoAcessoEm());

        return dadosUsuario;
    }
}