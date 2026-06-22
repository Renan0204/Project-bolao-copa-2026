package br.com.bolao.copa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Selecao selecaoA;

    @ManyToOne
    private Selecao selecaoB;

    @ManyToOne
    private Estadio estadio;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime dataHora;

    private String fase;

    private String grupo;

    private String status = "Agendada";

    private Integer golsSelecaoA;

    private Integer golsSelecaoB;

    public Long getId() {
        return id;
    }

    public Selecao getSelecaoA() {
        return selecaoA;
    }

    public Selecao getSelecaoB() {
        return selecaoB;
    }

    public Estadio getEstadio() {
        return estadio;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public String getFase() {
        return fase;
    }

    public String getGrupo() {
        return grupo;
    }

    public String getStatus() {
        return status;
    }

    public Integer getGolsSelecaoA() {
        return golsSelecaoA;
    }

    public Integer getGolsSelecaoB() {
        return golsSelecaoB;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSelecaoA(Selecao selecaoA) {
        this.selecaoA = selecaoA;
    }

    public void setSelecaoB(Selecao selecaoB) {
        this.selecaoB = selecaoB;
    }

    public void setEstadio(Estadio estadio) {
        this.estadio = estadio;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public void setFase(String fase) {
        this.fase = fase;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setGolsSelecaoA(Integer golsSelecaoA) {
        this.golsSelecaoA = golsSelecaoA;
    }

    public void setGolsSelecaoB(Integer golsSelecaoB) {
        this.golsSelecaoB = golsSelecaoB;
    }
}