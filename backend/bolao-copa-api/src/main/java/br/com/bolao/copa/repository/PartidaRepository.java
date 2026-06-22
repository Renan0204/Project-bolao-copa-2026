package br.com.bolao.copa.repository;

import br.com.bolao.copa.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartidaRepository extends JpaRepository<Partida, Long> {

    List<Partida> findAllByOrderByDataHoraAsc();
}