package br.com.bolao.copa.repository;

import br.com.bolao.copa.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartidaRepository extends JpaRepository<Partida, Long> {
}