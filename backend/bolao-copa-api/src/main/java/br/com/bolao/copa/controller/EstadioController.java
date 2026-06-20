package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Estadio;
import br.com.bolao.copa.service.EstadioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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
    public String salvarEstadio(@ModelAttribute Estadio estadio, Model model) {
        try {
            estadioService.salvar(estadio);
            return "redirect:/estadios";
        } catch (RuntimeException erro) {
            model.addAttribute("estadio", estadio);
            model.addAttribute("erro", erro.getMessage());
            return "estadios/form";
        }
    }

    @GetMapping("/estadios/editar/{id}")
    public String editarEstadio(@PathVariable Long id, Model model) {
        Estadio estadio = estadioService.buscarPorId(id);

        if (estadio == null) {
            return "redirect:/estadios";
        }

        model.addAttribute("estadio", estadio);
        return "estadios/form";
    }

    @GetMapping("/estadios/excluir/{id}")
    public String excluirEstadio(@PathVariable Long id) {
        estadioService.excluir(id);
        return "redirect:/estadios";
    }
}