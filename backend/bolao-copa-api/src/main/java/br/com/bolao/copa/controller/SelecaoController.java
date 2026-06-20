package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Selecao;
import br.com.bolao.copa.service.SelecaoService;
import br.com.bolao.copa.util.OpcoesAdmin;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
    public String salvarSelecao(@ModelAttribute Selecao selecao,
                                Model model,
                                RedirectAttributes redirectAttributes) {
        try {
            selecaoService.salvar(selecao);
            redirectAttributes.addFlashAttribute("sucesso", "Seleção salva com sucesso.");
            return "redirect:/selecoes";
        } catch (RuntimeException erro) {
            model.addAttribute("selecao", selecao);
            model.addAttribute("grupos", OpcoesAdmin.grupos());
            model.addAttribute("erro", erro.getMessage());
            return "selecoes/form";
        }
    }

    @GetMapping("/selecoes/editar/{id}")
    public String editarSelecao(@PathVariable Long id,
                                Model model,
                                RedirectAttributes redirectAttributes) {
        Selecao selecao = selecaoService.buscarPorId(id);

        if (selecao == null) {
            redirectAttributes.addFlashAttribute("erro", "Seleção não encontrada.");
            return "redirect:/selecoes";
        }

        model.addAttribute("selecao", selecao);
        model.addAttribute("grupos", OpcoesAdmin.grupos());

        return "selecoes/form";
    }

    @GetMapping("/selecoes/excluir/{id}")
    public String excluirSelecao(@PathVariable Long id,
                                 RedirectAttributes redirectAttributes) {
        try {
            selecaoService.excluir(id);
            redirectAttributes.addFlashAttribute("sucesso", "Seleção excluída com sucesso.");
        } catch (RuntimeException erro) {
            redirectAttributes.addFlashAttribute("erro", "Não foi possível excluir a seleção.");
        }

        return "redirect:/selecoes";
    }
}