package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Selecao;
import br.com.bolao.copa.repository.SelecaoRepository;
import br.com.bolao.copa.util.OpcoesAdmin;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SelecaoService {

    private final SelecaoRepository selecaoRepository;

    public SelecaoService(SelecaoRepository selecaoRepository) {
        this.selecaoRepository = selecaoRepository;
    }

    public List<Selecao> listarTodas() {
        return selecaoRepository.findAll();
    }

    public Selecao buscarPorId(Long id) {
        return selecaoRepository.findById(id).orElse(null);
    }

    public void salvar(Selecao selecao) {
        validarSelecao(selecao);
        selecaoRepository.save(selecao);
    }

    public void excluir(Long id) {
        selecaoRepository.deleteById(id);
    }

    private void validarSelecao(Selecao selecao) {
        if (selecao == null) {
            throw new RuntimeException("Informe os dados da seleção.");
        }

        if (selecao.getNome() == null || selecao.getNome().trim().isEmpty()) {
            throw new RuntimeException("O nome da seleção é obrigatório.");
        }

        if (selecao.getCodigoFifa() == null || selecao.getCodigoFifa().trim().isEmpty()) {
            throw new RuntimeException("O código FIFA é obrigatório.");
        }

        if (!OpcoesAdmin.grupoValido(selecao.getGrupo())) {
            throw new RuntimeException("Selecione um grupo válido.");
        }

        selecao.setNome(selecao.getNome().trim());
        selecao.setCodigoFifa(selecao.getCodigoFifa().trim().toUpperCase());

        validarDuplicidade(selecao);
        validarQuantidadePorGrupo(selecao);
    }

    private void validarDuplicidade(Selecao selecao) {
        if (selecao.getId() == null) {
            if (selecaoRepository.existsByNomeIgnoreCase(selecao.getNome())) {
                throw new RuntimeException("Já existe uma seleção cadastrada com esse nome.");
            }

            if (selecaoRepository.existsByCodigoFifaIgnoreCase(selecao.getCodigoFifa())) {
                throw new RuntimeException("Já existe uma seleção cadastrada com esse código FIFA.");
            }
        }
    }

    private void validarQuantidadePorGrupo(Selecao selecao) {
        if (selecao.getId() != null) {
            Selecao selecaoAtual = buscarPorId(selecao.getId());

            if (selecaoAtual != null && selecao.getGrupo().equals(selecaoAtual.getGrupo())) {
                return;
            }
        }

        long quantidadeNoGrupo = selecaoRepository.countByGrupo(selecao.getGrupo());

        if (quantidadeNoGrupo >= 4) {
            throw new RuntimeException("Este grupo já possui 4 seleções cadastradas.");
        }
    }
}