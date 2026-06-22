package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RankingService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Map<String, Object> listarRanking(int pagina, int tamanho) {
        if (pagina < 0) {
            pagina = 0;
        }

        if (tamanho < 50) {
            tamanho = 50;
        }

        PageRequest paginacao = PageRequest.of(pagina, tamanho);

        Page<Usuario> usuarios = usuarioRepository
                .findAllByOrderByPontuacaoTotalDescPlacaresExatosDescCriadoEmAsc(paginacao);

        List<Map<String, Object>> ranking = new ArrayList<>();

        int posicaoInicial = pagina * tamanho;

        for (int i = 0; i < usuarios.getContent().size(); i++) {
            Usuario usuario = usuarios.getContent().get(i);

            Map<String, Object> item = montarItemRanking(usuario, posicaoInicial + i + 1);

            ranking.add(item);
        }

        Map<String, Object> resposta = new HashMap<>();

        resposta.put("pagina", pagina);
        resposta.put("tamanho", tamanho);
        resposta.put("totalElementos", usuarios.getTotalElements());
        resposta.put("totalPaginas", usuarios.getTotalPages());
        resposta.put("ranking", ranking);

        return resposta;
    }

    public Map<String, Object> buscarPosicaoUsuario(Usuario usuarioLogado) {
        if (usuarioLogado == null || usuarioLogado.getId() == null) {
            return null;
        }

        List<Usuario> usuarios = usuarioRepository
                .findAllByOrderByPontuacaoTotalDescPlacaresExatosDescCriadoEmAsc();

        for (int i = 0; i < usuarios.size(); i++) {
            Usuario usuario = usuarios.get(i);

            if (usuario.getId().equals(usuarioLogado.getId())) {
                return montarItemRanking(usuario, i + 1);
            }
        }

        return null;
    }

    private Map<String, Object> montarItemRanking(Usuario usuario, int posicao) {
        Map<String, Object> item = new HashMap<>();

        item.put("posicao", posicao);
        item.put("id", usuario.getId());
        item.put("nome", usuario.getNome());
        item.put("avatarUrl", usuario.getAvatarUrl());
        item.put("pontuacaoTotal", usuario.getPontuacaoTotal() != null ? usuario.getPontuacaoTotal() : 0);
        item.put("placaresExatos", usuario.getPlacaresExatos() != null ? usuario.getPlacaresExatos() : 0);

        return item;
    }
}