package br.com.bolao.copa.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, length = 100)
    private String senha;

    private String tipo = "USER";

    private Integer pontuacaoTotal = 0;

    private Integer placaresExatos = 0;

    private Boolean bloqueado = false;

    private String avatarUrl;

    private LocalDateTime criadoEm;

    private LocalDateTime ultimoAcessoEm;

    private String tokenRedefinicaoSenha;

    private LocalDateTime expiracaoTokenRedefinicaoSenha;

    @PrePersist
    public void antesDeSalvar() {
        if (pontuacaoTotal == null) {
            pontuacaoTotal = 0;
        }

        if (placaresExatos == null) {
            placaresExatos = 0;
        }

        if (bloqueado == null) {
            bloqueado = false;
        }

        if (tipo == null || tipo.isBlank()) {
            tipo = "USER";
        }

        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    public String getTipo() {
        return tipo;
    }

    public Integer getPontuacaoTotal() {
        return pontuacaoTotal;
    }

    public Integer getPlacaresExatos() {
        return placaresExatos;
    }

    public Boolean getBloqueado() {
        return bloqueado;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public LocalDateTime getUltimoAcessoEm() {
        return ultimoAcessoEm;
    }

    public String getTokenRedefinicaoSenha() {
        return tokenRedefinicaoSenha;
    }

    public LocalDateTime getExpiracaoTokenRedefinicaoSenha() {
        return expiracaoTokenRedefinicaoSenha;
    }

    public String getTokenRecuperacaoSenha() {
        return tokenRedefinicaoSenha;
    }

    public LocalDateTime getExpiracaoTokenRecuperacaoSenha() {
        return expiracaoTokenRedefinicaoSenha;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setPontuacaoTotal(Integer pontuacaoTotal) {
        this.pontuacaoTotal = pontuacaoTotal;
    }

    public void setPlacaresExatos(Integer placaresExatos) {
        this.placaresExatos = placaresExatos;
    }

    public void setBloqueado(Boolean bloqueado) {
        this.bloqueado = bloqueado;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public void setUltimoAcessoEm(LocalDateTime ultimoAcessoEm) {
        this.ultimoAcessoEm = ultimoAcessoEm;
    }

    public void setTokenRedefinicaoSenha(String tokenRedefinicaoSenha) {
        this.tokenRedefinicaoSenha = tokenRedefinicaoSenha;
    }

    public void setExpiracaoTokenRedefinicaoSenha(LocalDateTime expiracaoTokenRedefinicaoSenha) {
        this.expiracaoTokenRedefinicaoSenha = expiracaoTokenRedefinicaoSenha;
    }

    public void setTokenRecuperacaoSenha(String tokenRecuperacaoSenha) {
        this.tokenRedefinicaoSenha = tokenRecuperacaoSenha;
    }

    public void setExpiracaoTokenRecuperacaoSenha(LocalDateTime expiracaoTokenRecuperacaoSenha) {
        this.expiracaoTokenRedefinicaoSenha = expiracaoTokenRecuperacaoSenha;
    }
}