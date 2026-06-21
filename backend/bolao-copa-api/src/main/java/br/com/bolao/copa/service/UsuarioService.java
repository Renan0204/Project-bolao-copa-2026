package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public List<Usuario> listarPorTermo(String termo) {
        if (termo == null || termo.isBlank()) {
            return listar();
        }

        String termoBusca = termo.trim().toLowerCase();

        return repository.findAll()
                .stream()
                .filter(usuario -> {
                    boolean nomeEncontrado = usuario.getNome() != null
                            && usuario.getNome().toLowerCase().contains(termoBusca);

                    boolean emailEncontrado = usuario.getEmail() != null
                            && usuario.getEmail().toLowerCase().contains(termoBusca);

                    return nomeEncontrado || emailEncontrado;
                })
                .toList();
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

    public Usuario solicitarRecuperacaoSenha(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Informe o e-mail.");
        }

        Usuario usuario = repository.findByEmail(email);

        if (usuario == null) {
            return null;
        }

        if (Boolean.TRUE.equals(usuario.getBloqueado())) {
            throw new RuntimeException("Usuário bloqueado.");
        }

        String token = UUID.randomUUID().toString();

        usuario.setTokenRecuperacaoSenha(token);
        usuario.setTokenRecuperacaoExpiraEm(LocalDateTime.now().plusMinutes(30));

        return repository.save(usuario);
    }

    public Usuario redefinirSenha(String token, String novaSenha) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("Token de recuperação é obrigatório.");
        }

        if (novaSenha == null || novaSenha.isBlank()) {
            throw new RuntimeException("Nova senha é obrigatória.");
        }

        if (novaSenha.length() < 4) {
            throw new RuntimeException("A nova senha deve ter pelo menos 4 caracteres.");
        }

        Usuario usuario = repository.findByTokenRecuperacaoSenha(token);

        if (usuario == null) {
            throw new RuntimeException("Token inválido.");
        }

        if (usuario.getTokenRecuperacaoExpiraEm() == null
                || usuario.getTokenRecuperacaoExpiraEm().isBefore(LocalDateTime.now())) {
            usuario.setTokenRecuperacaoSenha(null);
            usuario.setTokenRecuperacaoExpiraEm(null);
            repository.save(usuario);

            throw new RuntimeException("Token expirado. Solicite uma nova recuperação de senha.");
        }

        usuario.setSenha(novaSenha);
        usuario.setTokenRecuperacaoSenha(null);
        usuario.setTokenRecuperacaoExpiraEm(null);

        return repository.save(usuario);
    }
}