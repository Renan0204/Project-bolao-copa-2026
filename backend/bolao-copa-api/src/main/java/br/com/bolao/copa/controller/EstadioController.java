package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Estadio;
import br.com.bolao.copa.service.EstadioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class EstadioController {

    private final EstadioService estadioService;

    public EstadioController(EstadioService estadioService) {
        this.estadioService = estadioService;
    }

    @GetMapping("/estadios")
    public String listarEstadios(Model model) {
        model.addAttribute("estadios", estadioService.listarTodos());
        return "estadios/lista";
    }

    @GetMapping("/estadios/novo")
    public String novoEstadio(Model model) {
        model.addAttribute("estadio", new Estadio());
        return "estadios/form";
    }

    @PostMapping("/estadios/salvar")
    public String salvarEstadio(@ModelAttribute Estadio estadio,
                                Model model,
                                RedirectAttributes redirectAttributes) {
        try {
            estadioService.salvar(estadio);
            redirectAttributes.addFlashAttribute("sucesso", "Estádio salvo com sucesso.");
            return "redirect:/estadios";
        } catch (RuntimeException erro) {
            model.addAttribute("estadio", estadio);
            model.addAttribute("erro", erro.getMessage());
            return "estadios/form";
        }
    }

    @GetMapping("/estadios/editar/{id}")
    public String editarEstadio(@PathVariable Long id,
                                Model model,
                                RedirectAttributes redirectAttributes) {
        Estadio estadio = estadioService.buscarPorId(id);

        if (estadio == null) {
            redirectAttributes.addFlashAttribute("erro", "Estádio não encontrado.");
            return "redirect:/estadios";
        }

        model.addAttribute("estadio", estadio);
        return "estadios/form";
    }

    @GetMapping("/estadios/excluir/{id}")
    public String excluirEstadio(@PathVariable Long id,
                                 RedirectAttributes redirectAttributes) {
        try {
            estadioService.excluir(id);
            redirectAttributes.addFlashAttribute("sucesso", "Estádio excluído com sucesso.");
        } catch (RuntimeException erro) {
            redirectAttributes.addFlashAttribute("erro", "Não foi possível excluir o estádio.");
        }

        return "redirect:/estadios";
    }
}