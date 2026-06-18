package br.com.bolao.copa.repository;

import br.com.bolao.copa.model.Selecao;
import org.springframework.data.jpa.repository.JpaRepository;

//Criado para não precisar fazer comunicação com o DB manualmente, o JpaRepository já trás métodos prontos.

public interface SelecaoRepository extends JpaRepository<Selecao, Long> {
}
