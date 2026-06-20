package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Palpite;
import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.service.PalpiteService;
import br.com.bolao.copa.service.TokenService;
import br.com.bolao.copa.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/palpites")
@CrossOrigin(origins = "*")
public class PalpiteController {

    @Autowired
    private PalpiteService palpiteService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/partida/{partidaId}")
    public ResponseEntity<Map<String, Object>> registrarPalpite(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @PathVariable Long partidaId,
            @RequestBody Palpite dadosPalpite
    ) {
        Map<String, Object> resposta = new HashMap<>();

        Usuario usuario = buscarUsuarioPeloToken(authorizationHeader);

        if (usuario == null) {
            resposta.put("erro", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        try {
            Palpite palpite = palpiteService.salvar(usuario, partidaId, dadosPalpite);

            resposta.put("mensagem", "Palpite registrado com sucesso.");
            resposta.put("palpite", montarPalpite(palpite));

            return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
        } catch (RuntimeException erro) {
            resposta.put("erro", erro.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(resposta);
        }
    }

    @PutMapping("/{palpiteId}")
    public ResponseEntity<Map<String, Object>> editarPalpite(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @PathVariable Long palpiteId,
            @RequestBody Palpite dadosPalpite
    ) {
        Map<String, Object> resposta = new HashMap<>();

        Usuario usuario = buscarUsuarioPeloToken(authorizationHeader);

        if (usuario == null) {
            resposta.put("erro", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        try {
            Palpite palpite = palpiteService.editar(usuario, palpiteId, dadosPalpite);

            resposta.put("mensagem", "Palpite atualizado com sucesso.");
            resposta.put("palpite", montarPalpite(palpite));

            return ResponseEntity.ok(resposta);
        } catch (RuntimeException erro) {
            resposta.put("erro", erro.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(resposta);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> listarMeusPalpites(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Map<String, Object> resposta = new HashMap<>();

        Usuario usuario = buscarUsuarioPeloToken(authorizationHeader);

        if (usuario == null) {
            resposta.put("erro", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        List<Palpite> palpites = palpiteService.listarMeusPalpites(usuario);
        List<Map<String, Object>> lista = new ArrayList<>();

        for (Palpite palpite : palpites) {
            lista.add(montarPalpite(palpite));
        }

        resposta.put("total", lista.size());
        resposta.put("palpites", lista);

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/{palpiteId}")
    public ResponseEntity<Map<String, Object>> buscarPalpite(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @PathVariable Long palpiteId
    ) {
        Map<String, Object> resposta = new HashMap<>();

        Usuario usuario = buscarUsuarioPeloToken(authorizationHeader);

        if (usuario == null) {
            resposta.put("erro", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        try {
            Palpite palpite = palpiteService.listar(palpiteId);

            if (!palpite.getUsuario().getId().equals(usuario.getId())) {
                resposta.put("erro", "Você não pode visualizar um palpite de outro usuário.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(resposta);
            }

            resposta.put("palpite", montarPalpite(palpite));

            return ResponseEntity.ok(resposta);
        } catch (RuntimeException erro) {
            resposta.put("erro", erro.getMessage());
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

    private Map<String, Object> montarPalpite(Palpite palpite) {
        Map<String, Object> dados = new HashMap<>();

        dados.put("id", palpite.getId());
        dados.put("golsSelecaoA", palpite.getGolsSelecaoA());
        dados.put("golsSelecaoB", palpite.getGolsSelecaoB());
        dados.put("pontos", palpite.getPontos());
        dados.put("criterioPontuacao", palpite.getCriterioPontuacao());
        dados.put("criadoEm", palpite.getCriadoEm());
        dados.put("atualizadoEm", palpite.getAtualizadoEm());

        if (palpite.getPartida() != null) {
            dados.put("partida", montarPartida(palpite.getPartida()));
        }

        return dados;
    }

    private Map<String, Object> montarPartida(Partida partida) {
        Map<String, Object> dados = new HashMap<>();

        dados.put("id", partida.getId());
        dados.put("dataHora", partida.getDataHora());
        dados.put("fase", partida.getFase());
        dados.put("estadio", partida.getEstadio() != null ? partida.getEstadio().getNome() : null);
        dados.put("grupo", partida.getGrupo());
        dados.put("status", partida.getStatus());
        dados.put("golsSelecaoA", partida.getGolsSelecaoA());
        dados.put("golsSelecaoB", partida.getGolsSelecaoB());

        if (partida.getSelecaoA() != null) {
            dados.put("selecaoA", partida.getSelecaoA().getNome());
            dados.put("selecaoAId", partida.getSelecaoA().getId());
        }

        if (partida.getSelecaoB() != null) {
            dados.put("selecaoB", partida.getSelecaoB().getNome());
            dados.put("selecaoBId", partida.getSelecaoB().getId());
        }

        return dados;
    }
}