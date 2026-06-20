package br.com.bolao.copa.repository;

import br.com.bolao.copa.model.Selecao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SelecaoRepository extends JpaRepository<Selecao, Long> {

    long countByGrupo(String grupo);

    boolean existsByNomeIgnoreCase(String nome);

    boolean existsByCodigoFifaIgnoreCase(String codigoFifa);

    Selecao findByNomeIgnoreCase(String nome);

    Selecao findByCodigoFifaIgnoreCase(String codigoFifa);

    List<Selecao> findByGrupoOrderByNomeAsc(String grupo);
}