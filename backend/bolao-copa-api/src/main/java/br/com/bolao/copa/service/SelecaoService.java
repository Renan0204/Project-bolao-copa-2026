package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Selecao;
import br.com.bolao.copa.repository.SelecaoRepository;
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

    public void salvar(Selecao selecao) {
        selecaoRepository.save(selecao);
    }

    public Selecao buscarPorId(Long id) {
        return selecaoRepository.findById(id).orElse(null);
    }

    public void excluir(Long id) {
        selecaoRepository.deleteById(id);
    }
}
