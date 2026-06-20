package br.com.bolao.copa.util;

import java.util.List;

public class OpcoesAdmin {

    private OpcoesAdmin() {
    }

    public static List<String> grupos() {
        return List.of(
                "Grupo A",
                "Grupo B",
                "Grupo C",
                "Grupo D",
                "Grupo E",
                "Grupo F",
                "Grupo G",
                "Grupo H",
                "Grupo I",
                "Grupo J",
                "Grupo K",
                "Grupo L"
        );
    }

    public static List<String> fases() {
        return List.of(
                "Fase de Grupos",
                "Segunda Rodada",
                "Oitavas de Final",
                "Quartas de Final",
                "Semi-finais",
                "Disputa de Terceiro Lugar",
                "Final"
        );
    }

    public static boolean grupoValido(String grupo) {
        return grupo != null && grupos().contains(grupo);
    }

    public static boolean faseValida(String fase) {
        return fase != null && fases().contains(fase);
    }
}