package br.com.bolao.copa.repository;

import br.com.bolao.copa.model.Selecao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SelecaoRepository extends JpaRepository<Selecao, Long> {

    long countByGrupo(String grupo);

    boolean existsByNomeIgnoreCase(String nome);

    boolean existsByCodigoFifaIgnoreCase(String codigoFifa);
}