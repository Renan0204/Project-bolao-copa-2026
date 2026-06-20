package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public Usuario salvar(Usuario usuario) {
        Usuario usuarioComMesmoEmail = repository.findByEmail(usuario.getEmail());

        if (usuarioComMesmoEmail != null) {
            boolean criandoNovoUsuario = usuario.getId() == null;
            boolean editandoOutroUsuario = usuario.getId() != null
                    && !usuarioComMesmoEmail.getId().equals(usuario.getId());

            if (criandoNovoUsuario || editandoOutroUsuario) {
                throw new RuntimeException("E-mail já cadastrado.");
            }
        }

        if (usuario.getTipo() == null || usuario.getTipo().isBlank()) {
            usuario.setTipo("USER");
        }

        if (usuario.getPontuacaoTotal() == null) {
            usuario.setPontuacaoTotal(0);
        }

        if (usuario.getPlacaresExatos() == null) {
            usuario.setPlacaresExatos(0);
        }

        if (usuario.getBloqueado() == null) {
            usuario.setBloqueado(false);
        }

        if (usuario.getCriadoEm() == null) {
            usuario.setCriadoEm(LocalDateTime.now());
        }

        return repository.save(usuario);
    }

    public Usuario listar(Long id) {
        return repository.findById(id).get();
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public void remover(Long id) {
        repository.deleteById(id);
    }

    public Usuario buscarPorEmail(String email) {
        return repository.findByEmail(email);
    }

    public Usuario autenticar(String email, String senha) {
        Usuario usuario = repository.findByEmail(email);

        if (usuario == null) {
            return null;
        }

        if (Boolean.TRUE.equals(usuario.getBloqueado())) {
            return null;
        }

        if (!usuario.getSenha().equals(senha)) {
            return null;
        }

        usuario.setUltimoAcessoEm(LocalDateTime.now());
        return repository.save(usuario);
    }

    public Usuario bloquearDesbloquear(Long id) {
        Usuario usuario = listar(id);

        usuario.setBloqueado(!Boolean.TRUE.equals(usuario.getBloqueado()));

        return repository.save(usuario);
    }
}