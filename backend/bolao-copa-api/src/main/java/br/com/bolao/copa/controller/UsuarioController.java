package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Usuario;
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

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> editarPerfil(
            @PathVariable Long id,
            @RequestBody Usuario dadosAtualizados
    ) {
        Map<String, Object> resposta = new HashMap<>();

        try {
            Usuario usuario = usuarioService.listar(id);

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
        } catch (RuntimeException erro) {
            resposta.put("erro", "Não foi possível atualizar o perfil.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> excluirConta(@PathVariable Long id) {
        Map<String, Object> resposta = new HashMap<>();

        try {
            usuarioService.remover(id);

            resposta.put("mensagem", "Conta excluída com sucesso.");

            return ResponseEntity.ok(resposta);
        } catch (RuntimeException erro) {
            resposta.put("erro", "Não foi possível excluir a conta.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> resposta = new HashMap<>();

        resposta.put("mensagem", "Logout realizado com sucesso.");

        return ResponseEntity.ok(resposta);
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