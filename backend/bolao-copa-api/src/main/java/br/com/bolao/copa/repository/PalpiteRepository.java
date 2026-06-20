package br.com.bolao.copa.repository;

import br.com.bolao.copa.model.Palpite;
import br.com.bolao.copa.model.Partida;
import br.com.bolao.copa.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PalpiteRepository extends JpaRepository<Palpite, Long> {

    Palpite findByUsuarioAndPartida(Usuario usuario, Partida partida);

    List<Palpite> findByUsuarioOrderByCriadoEmDesc(Usuario usuario);

    List<Palpite> findByPartida(Partida partida);
}