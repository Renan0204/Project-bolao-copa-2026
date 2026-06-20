package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Estadio;
import br.com.bolao.copa.repository.EstadioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstadioService {

    private final EstadioRepository estadioRepository;

    public EstadioService(EstadioRepository estadioRepository) {
        this.estadioRepository = estadioRepository;
    }

    public List<Estadio> listarTodos() {
        return estadioRepository.findAll();
    }

    public Estadio buscarPorId(Long id) {
        return estadioRepository.findById(id).orElse(null);
    }

    public void salvar(Estadio estadio) {
        if (estadio == null) {
            throw new RuntimeException("Informe os dados do estádio.");
        }

        if (estadio.getNome() == null || estadio.getNome().trim().isEmpty()) {
            throw new RuntimeException("O nome do estádio é obrigatório.");
        }

        estadio.setNome(estadio.getNome().trim());

        Estadio estadioComMesmoNome = estadioRepository.findByNomeIgnoreCase(estadio.getNome());

        if (estadioComMesmoNome != null) {
            boolean criandoNovoEstadio = estadio.getId() == null;

            boolean editandoOutroEstadio = estadio.getId() != null
                    && !estadioComMesmoNome.getId().equals(estadio.getId());

            if (criandoNovoEstadio || editandoOutroEstadio) {
                throw new RuntimeException("Já existe um estádio cadastrado com esse nome.");
            }
        }

        estadioRepository.save(estadio);
    }

    public void excluir(Long id) {
        estadioRepository.deleteById(id);
    }
}