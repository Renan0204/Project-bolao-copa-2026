package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Selecao;
import br.com.bolao.copa.repository.SelecaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service //Dizemos que é uma classe com regras de negócio
public class SelecaoService {

    private final SelecaoRepository selecaoRepository;

    public SelecaoService(SelecaoRepository selecaoRepository) {
        this.selecaoRepository = selecaoRepository;
    }

    public List<Selecao> listarTodas() {
        return selecaoRepository.findAll();
    } //Metodo para listar as seleções


    //O service recebe o Repository para poder acessar os dados do banco.
}
