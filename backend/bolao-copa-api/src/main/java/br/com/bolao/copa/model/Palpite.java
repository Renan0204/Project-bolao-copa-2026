package br.com.bolao.copa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class Palpite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuario;

    @ManyToOne
    private Partida partida;

    private Integer golsSelecaoA;

    private Integer golsSelecaoB;

    private Integer pontos = 0;

    private String criterioPontuacao;

    private LocalDateTime criadoEm = LocalDateTime.now();

    private LocalDateTime atualizadoEm;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }


    public Partida getPartida() {
        return partida;
    }

    public void setPartida(Partida partida) {
        this.partida = partida;
    }


    public Integer getGolsSelecaoA() {
        return golsSelecaoA;
    }

    public void setGolsSelecaoA(Integer golsSelecaoA) {
        this.golsSelecaoA = golsSelecaoA;
    }


    public Integer getGolsSelecaoB() {
        return golsSelecaoB;
    }

    public void setGolsSelecaoB(Integer golsSelecaoB) {
        this.golsSelecaoB = golsSelecaoB;
    }


    public Integer getPontos() {
        return pontos;
    }

    public void setPontos(Integer pontos) {
        this.pontos = pontos;
    }


    public String getCriterioPontuacao() {
        return criterioPontuacao;
    }

    public void setCriterioPontuacao(String criterioPontuacao) {
        this.criterioPontuacao = criterioPontuacao;
    }


    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }


    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}