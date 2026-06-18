package br.com.bolao.copa.controller;

import br.com.bolao.copa.service.SelecaoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SelecaoController {

    private final SelecaoService selecaoService;

    public SelecaoController(SelecaoService selecaoService) {
        this.selecaoService = selecaoService;
    }

    @GetMapping("/selecoes") //Criamos a rota /selecoes
    public String listarSelecoes(Model model) {
        model.addAttribute("selecoes", selecaoService.listarTodas());
        return "selecoes/lista";
    } //Levamos dados do Java para o HTML com Model e apontamos o arquivo lista.html
}
