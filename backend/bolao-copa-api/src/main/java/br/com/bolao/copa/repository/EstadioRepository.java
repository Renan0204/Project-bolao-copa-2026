package br.com.bolao.copa.repository;

import br.com.bolao.copa.model.Estadio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstadioRepository extends JpaRepository<Estadio, Long> {

    boolean existsByNomeIgnoreCase(String nome);

    Estadio findByNomeIgnoreCase(String nome);
}