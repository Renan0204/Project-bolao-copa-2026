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

            Map<String, Object> item = new HashMap<>();
            item.put("posicao", posicaoInicial + i + 1);
            item.put("id", usuario.getId());
            item.put("nome", usuario.getNome());
            item.put("pontuacaoTotal", usuario.getPontuacaoTotal());
            item.put("placaresExatos", usuario.getPlacaresExatos());

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
        List<Usuario> usuarios = usuarioRepository
                .findAllByOrderByPontuacaoTotalDescPlacaresExatosDescCriadoEmAsc();

        for (int i = 0; i < usuarios.size(); i++) {
            Usuario usuario = usuarios.get(i);

            if (usuario.getId().equals(usuarioLogado.getId())) {
                Map<String, Object> resposta = new HashMap<>();

                resposta.put("posicao", i + 1);
                resposta.put("id", usuario.getId());
                resposta.put("nome", usuario.getNome());
                resposta.put("pontuacaoTotal", usuario.getPontuacaoTotal());
                resposta.put("placaresExatos", usuario.getPlacaresExatos());

                return resposta;
            }
        }

        return null;
    }
}