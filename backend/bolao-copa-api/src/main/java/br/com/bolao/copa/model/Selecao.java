package br.com.bolao.copa.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Selecao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String codigoFifa;

    private String grupo;

    @Column(length = 1000)
    private String bandeiraUrl;

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCodigoFifa() {
        return codigoFifa;
    }

    public String getGrupo() {
        return grupo;
    }

    public String getBandeiraUrl() {
        return bandeiraUrl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCodigoFifa(String codigoFifa) {
        this.codigoFifa = codigoFifa;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }

    public void setBandeiraUrl(String bandeiraUrl) {
        this.bandeiraUrl = bandeiraUrl;
    }
}