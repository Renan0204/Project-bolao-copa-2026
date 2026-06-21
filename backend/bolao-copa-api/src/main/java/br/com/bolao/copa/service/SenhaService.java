package br.com.bolao.copa.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SenhaService {

    private final BCryptPasswordEncoder passwordEncoder;

    public SenhaService(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String gerarHash(String senhaPura) {
        if (senhaPura == null || senhaPura.isBlank()) {
            throw new RuntimeException("A senha não pode ser vazia.");
        }

        return passwordEncoder.encode(senhaPura);
    }

    public boolean senhaConfere(String senhaDigitada, String senhaSalvaNoBanco) {
        if (senhaDigitada == null || senhaSalvaNoBanco == null) {
            return false;
        }

        if (ehHashBCrypt(senhaSalvaNoBanco)) {
            return passwordEncoder.matches(senhaDigitada, senhaSalvaNoBanco);
        }

        return senhaDigitada.equals(senhaSalvaNoBanco);
    }

    public boolean ehHashBCrypt(String senha) {
        if (senha == null) {
            return false;
        }

        return senha.startsWith("$2a$")
                || senha.startsWith("$2b$")
                || senha.startsWith("$2y$");
    }
}