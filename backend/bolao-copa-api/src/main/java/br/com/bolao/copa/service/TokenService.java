package br.com.bolao.copa.service;

import br.com.bolao.copa.model.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@Service
public class TokenService {

    private static final String SEGREDO = "bolao-copa-2026";
    private static final String EMISSOR = "bolao-copa-api";

    public String gerarToken(Usuario usuario) {
        Algorithm algorithm = Algorithm.HMAC256(SEGREDO);

        return JWT.create()
                .withIssuer(EMISSOR)
                .withSubject(usuario.getEmail())
                .withClaim("id", usuario.getId())
                .withClaim("nome", usuario.getNome())
                .withClaim("tipo", usuario.getTipo())
                .withExpiresAt(gerarDataExpiracao())
                .sign(algorithm);
    }

    public String validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(SEGREDO);

            DecodedJWT jwt = JWT.require(algorithm)
                    .withIssuer(EMISSOR)
                    .build()
                    .verify(token);

            return jwt.getSubject();
        } catch (Exception erro) {
            return null;
        }
    }

    public String extrairTokenDoHeader(String authorizationHeader) {
        if (authorizationHeader == null) {
            return null;
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        return authorizationHeader.replace("Bearer ", "");
    }

    private Date gerarDataExpiracao() {
        LocalDateTime dataExpiracao = LocalDateTime.now().plusHours(2);

        return Date.from(dataExpiracao.toInstant(ZoneOffset.of("-03:00")));
    }
}