package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.service.RankingService;
import br.com.bolao.copa.service.TokenService;
import br.com.bolao.copa.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ranking")
@CrossOrigin(origins = "*")
public class RankingController {

    @Autowired
    private RankingService rankingService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listarRanking(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Map<String, Object> ranking = rankingService.listarRanking(page, size);

        return ResponseEntity.ok(ranking);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> minhaPosicao(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Map<String, Object> resposta = new HashMap<>();

        Usuario usuario = buscarUsuarioPeloToken(authorizationHeader);

        if (usuario == null) {
            resposta.put("erro", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        Map<String, Object> posicao = rankingService.buscarPosicaoUsuario(usuario);

        if (posicao == null) {
            resposta.put("erro", "Usuário não encontrado no ranking.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resposta);
        }

        resposta.put("usuario", posicao);

        return ResponseEntity.ok(resposta);
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
}