package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Usuario;
import br.com.bolao.copa.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {

    private static final String TIPO_USUARIO_PADRAO = "USER";
    private static final String TIPO_ADMIN = "ADMIN";

    private final UsuarioRepository repository;
    private final SenhaService senhaService;

    public UsuarioService(UsuarioRepository repository,
                          SenhaService senhaService) {
        this.repository = repository;
        this.senhaService = senhaService;
    }

    public Usuario salvar(Usuario usuario) {
        validarEmailDuplicado(usuario);
        aplicarValoresPadrao(usuario);
        prepararSenhaParaSalvar(usuario);

        return repository.save(usuario);
    }

    public Usuario listar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    public Usuario buscarPorId(Long id) {
        if (id == null) {
            return null;
        }

        return repository.findById(id).orElse(null);
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public List<Usuario> buscarPorNomeOuEmail(String termo) {
        if (termo == null || termo.isBlank()) {
            return listar();
        }

        return repository.findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByNomeAsc(
                termo.trim(),
                termo.trim()
        );
    }

    public List<Usuario> listarPorTermo(String termo) {
        return buscarPorNomeOuEmail(termo);
    }

    public void remover(Long id) {
        repository.deleteById(id);
    }

    public Usuario buscarPorEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        return repository.findByEmail(email.trim());
    }

    public Usuario autenticar(String email, String senhaDigitada) {
        if (email == null || email.isBlank() || senhaDigitada == null || senhaDigitada.isBlank()) {
            return null;
        }

        Usuario usuario = repository.findByEmail(email.trim());

        if (usuario == null) {
            return null;
        }

        if (Boolean.TRUE.equals(usuario.getBloqueado())) {
            return null;
        }

        if (!senhaService.senhaConfere(senhaDigitada, usuario.getSenha())) {
            return null;
        }

        migrarSenhaTextoParaBCryptSeNecessario(usuario, senhaDigitada);

        usuario.setUltimoAcessoEm(LocalDateTime.now());

        return repository.save(usuario);
    }

    public Usuario bloquearDesbloquear(Long id) {
        Usuario usuario = listar(id);

        usuario.setBloqueado(!Boolean.TRUE.equals(usuario.getBloqueado()));

        return repository.save(usuario);
    }

    public Usuario bloquearDesbloquear(Long id, Long idAdminLogado) {
        Usuario usuario = listar(id);

        if (idAdminLogado != null && usuario.getId() != null && usuario.getId().equals(idAdminLogado)) {
            throw new RuntimeException("Você não pode bloquear o próprio usuário administrador.");
        }

        usuario.setBloqueado(!Boolean.TRUE.equals(usuario.getBloqueado()));

        return repository.save(usuario);
    }

    public long contarUsuarios() {
        return repository.count();
    }

    public long contarUsuariosAtivosUltimas24h() {
        LocalDateTime dataHoraLimite = LocalDateTime.now().minusHours(24);

        return repository.countByUltimoAcessoEmAfter(dataHoraLimite);
    }

    public List<Usuario> listarRanking() {
        return repository.findAllByOrderByPontuacaoTotalDescPlacaresExatosDescCriadoEmAsc();
    }

    public String gerarTokenRedefinicaoSenha(String email) {
        Usuario usuario = gerarTokenParaUsuario(email);

        if (usuario == null) {
            return null;
        }

        return usuario.getTokenRedefinicaoSenha();
    }

    public String solicitarRedefinicaoSenha(String email) {
        return gerarTokenRedefinicaoSenha(email);
    }

    public Usuario solicitarRecuperacaoSenha(String email) {
        return gerarTokenParaUsuario(email);
    }

    private Usuario gerarTokenParaUsuario(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        Usuario usuario = repository.findByEmail(email.trim());

        if (usuario == null) {
            return null;
        }

        String token = UUID.randomUUID().toString();

        usuario.setTokenRedefinicaoSenha(token);
        usuario.setExpiracaoTokenRedefinicaoSenha(LocalDateTime.now().plusMinutes(30));

        return repository.save(usuario);
    }

    public Usuario buscarPorTokenRedefinicaoSenha(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }

        return repository.findByTokenRedefinicaoSenha(token.trim());
    }

    public boolean tokenRedefinicaoValido(String token) {
        Usuario usuario = buscarPorTokenRedefinicaoSenha(token);

        if (usuario == null) {
            return false;
        }

        LocalDateTime expiracao = usuario.getExpiracaoTokenRedefinicaoSenha();

        return expiracao != null && expiracao.isAfter(LocalDateTime.now());
    }

    public void redefinirSenha(String token, String novaSenha) {
        redefinirSenha(token, novaSenha, novaSenha);
    }

    public void redefinirSenha(String token, String novaSenha, String confirmarSenha) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("Token de redefinição inválido.");
        }

        if (novaSenha == null || novaSenha.isBlank()) {
            throw new RuntimeException("A nova senha é obrigatória.");
        }

        if (confirmarSenha == null || confirmarSenha.isBlank()) {
            throw new RuntimeException("A confirmação da senha é obrigatória.");
        }

        if (!novaSenha.equals(confirmarSenha)) {
            throw new RuntimeException("As senhas não conferem.");
        }

        Usuario usuario = repository.findByTokenRedefinicaoSenha(token.trim());

        if (usuario == null) {
            throw new RuntimeException("Token de redefinição inválido.");
        }

        if (usuario.getExpiracaoTokenRedefinicaoSenha() == null
                || usuario.getExpiracaoTokenRedefinicaoSenha().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token de redefinição expirado. Solicite uma nova recuperação de senha.");
        }

        usuario.setSenha(senhaService.gerarHash(novaSenha));
        usuario.setTokenRedefinicaoSenha(null);
        usuario.setExpiracaoTokenRedefinicaoSenha(null);

        repository.save(usuario);
    }

    public void alterarSenhaComToken(String token, String novaSenha, String confirmarSenha) {
        redefinirSenha(token, novaSenha, confirmarSenha);
    }

    private void validarEmailDuplicado(Usuario usuario) {
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new RuntimeException("O e-mail é obrigatório.");
        }

        Usuario usuarioComMesmoEmail = repository.findByEmail(usuario.getEmail().trim());

        if (usuarioComMesmoEmail == null) {
            return;
        }

        boolean criandoNovoUsuario = usuario.getId() == null;
        boolean editandoOutroUsuario = usuario.getId() != null
                && !usuarioComMesmoEmail.getId().equals(usuario.getId());

        if (criandoNovoUsuario || editandoOutroUsuario) {
            throw new RuntimeException("E-mail já cadastrado.");
        }
    }

    private void aplicarValoresPadrao(Usuario usuario) {
        usuario.setEmail(usuario.getEmail().trim());

        if (usuario.getNome() != null) {
            usuario.setNome(usuario.getNome().trim());
        }

        if (usuario.getTipo() == null || usuario.getTipo().isBlank()) {
            usuario.setTipo(TIPO_USUARIO_PADRAO);
        } else {
            usuario.setTipo(usuario.getTipo().trim().toUpperCase());
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
    }

    private void prepararSenhaParaSalvar(Usuario usuario) {
        if (usuario.getId() == null) {
            prepararSenhaNovoUsuario(usuario);
            return;
        }

        prepararSenhaUsuarioExistente(usuario);
    }

    private void prepararSenhaNovoUsuario(Usuario usuario) {
        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new RuntimeException("A senha é obrigatória.");
        }

        if (!senhaService.ehHashBCrypt(usuario.getSenha())) {
            usuario.setSenha(senhaService.gerarHash(usuario.getSenha()));
        }
    }

    private void prepararSenhaUsuarioExistente(Usuario usuario) {
        Usuario usuarioAtual = repository.findById(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            usuario.setSenha(usuarioAtual.getSenha());
            return;
        }

        if (!senhaService.ehHashBCrypt(usuario.getSenha())) {
            usuario.setSenha(senhaService.gerarHash(usuario.getSenha()));
        }
    }

    private void migrarSenhaTextoParaBCryptSeNecessario(Usuario usuario, String senhaDigitada) {
        if (senhaService.ehHashBCrypt(usuario.getSenha())) {
            return;
        }

        usuario.setSenha(senhaService.gerarHash(senhaDigitada));
    }

    public boolean usuarioEhAdmin(Usuario usuario) {
        return usuario != null
                && usuario.getTipo() != null
                && TIPO_ADMIN.equalsIgnoreCase(usuario.getTipo());
    }
}