package br.com.bolao.copa.repository;

import br.com.bolao.copa.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByEmail(String email);

    boolean existsByEmail(String email);

    Page<Usuario> findAllByOrderByPontuacaoTotalDescPlacaresExatosDescCriadoEmAsc(Pageable pageable);

    List<Usuario> findAllByOrderByPontuacaoTotalDescPlacaresExatosDescCriadoEmAsc();
}