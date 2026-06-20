package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Selecao;
import br.com.bolao.copa.service.SelecaoService;
import br.com.bolao.copa.util.OpcoesAdmin;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class SelecaoController {

    private final SelecaoService selecaoService;

    public SelecaoController(SelecaoService selecaoService) {
        this.selecaoService = selecaoService;
    }

    @GetMapping("/selecoes")
    public String listarSelecoes(Model model) {
        model.addAttribute("selecoes", selecaoService.listarTodas());
        return "selecoes/lista";
    }

    @GetMapping("/selecoes/novo")
    public String novaSelecao(Model model) {
        model.addAttribute("selecao", new Selecao());
        model.addAttribute("grupos", OpcoesAdmin.grupos());
        return "selecoes/form";
    }

    @PostMapping("/selecoes/salvar")
    public String salvarSelecao(@ModelAttribute Selecao selecao, Model model) {
        try {
            selecaoService.salvar(selecao);
            return "redirect:/selecoes";
        } catch (RuntimeException erro) {
            model.addAttribute("selecao", selecao);
            model.addAttribute("grupos", OpcoesAdmin.grupos());
            model.addAttribute("erro", erro.getMessage());
            return "selecoes/form";
        }
    }

    @GetMapping("/selecoes/editar/{id}")
    public String editarSelecao(@PathVariable Long id, Model model) {
        Selecao selecao = selecaoService.buscarPorId(id);

        if (selecao == null) {
            return "redirect:/selecoes";
        }

        model.addAttribute("selecao", selecao);
        model.addAttribute("grupos", OpcoesAdmin.grupos());

        return "selecoes/form";
    }

    @GetMapping("/selecoes/excluir/{id}")
    public String excluirSelecao(@PathVariable Long id) {
        selecaoService.excluir(id);
        return "redirect:/selecoes";
    }
}