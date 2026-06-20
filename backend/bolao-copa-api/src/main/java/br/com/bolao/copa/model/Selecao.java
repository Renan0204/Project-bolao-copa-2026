package br.com.bolao.copa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity //Significa que vamos transformar isso em tabela no banco
public class Selecao {

    @Id //Marcamos o campo Id como chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Faz o banco gerar um Id automático
    private Long id;
    private String nome;
    private String codigoFifa;
    private String grupo;

    @Column(length = 1000)
    private String bandeiraUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBandeiraUrl() {
        return bandeiraUrl;
    }

    public void setBandeiraUrl(String bandeiraUrl) {
        this.bandeiraUrl = bandeiraUrl;
    }

    public String getGrupo() {
        return grupo;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }

    public String getCodigoFifa() {
        return codigoFifa;
    }

    public void setCodigoFifa(String codigoFifa) {
        this.codigoFifa = codigoFifa;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
