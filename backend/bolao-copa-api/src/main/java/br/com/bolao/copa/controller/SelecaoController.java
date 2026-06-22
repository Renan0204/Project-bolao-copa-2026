package br.com.bolao.copa.controller;

import br.com.bolao.copa.model.Selecao;
import br.com.bolao.copa.service.SelecaoService;
import br.com.bolao.copa.util.OpcoesAdmin;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Controller
public class SelecaoController {

    private static final String DIRETORIO_UPLOAD_BANDEIRAS = "uploads/bandeiras";

    private static final List<String> EXTENSOES_PERMITIDAS = List.of(
            ".png",
            ".jpg",
            ".jpeg",
            ".webp"
    );

    private static final List<String> CONTENT_TYPES_PERMITIDOS = List.of(
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp"
    );

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
        prepararFormulario(model, new Selecao());

        return "selecoes/form";
    }

    @PostMapping("/selecoes/salvar")
    public String salvarSelecao(Selecao selecao,
                                @RequestParam(value = "arquivoBandeira", required = false) MultipartFile arquivoBandeira,
                                Model model,
                                RedirectAttributes redirectAttributes) {
        try {
            validarBandeira(selecao, arquivoBandeira);

            if (arquivoFoiInformado(arquivoBandeira)) {
                String caminhoPublicoImagem = salvarArquivoBandeira(arquivoBandeira);
                selecao.setBandeiraUrl(caminhoPublicoImagem);
            } else if (temTexto(selecao.getBandeiraUrl())) {
                selecao.setBandeiraUrl(selecao.getBandeiraUrl().trim());
            }

            selecaoService.salvar(selecao);

            redirectAttributes.addFlashAttribute("sucesso", "Seleção salva com sucesso.");

            return "redirect:/selecoes";
        } catch (RuntimeException | IOException erro) {
            prepararFormulario(model, selecao);
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

        prepararFormulario(model, selecao);

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

    private void prepararFormulario(Model model, Selecao selecao) {
        model.addAttribute("selecao", selecao);
        model.addAttribute("grupos", OpcoesAdmin.grupos());
    }

    private void validarBandeira(Selecao selecao, MultipartFile arquivoBandeira) {
        boolean urlInformada = selecao != null && temTexto(selecao.getBandeiraUrl());
        boolean arquivoInformado = arquivoFoiInformado(arquivoBandeira);

        if (urlInformada && arquivoInformado) {
            throw new RuntimeException("Informe a bandeira por URL ou por arquivo, não pelos dois.");
        }

        if (!urlInformada && !arquivoInformado) {
            throw new RuntimeException("Informe a URL da bandeira ou anexe uma imagem.");
        }

        if (arquivoInformado) {
            validarArquivoBandeira(arquivoBandeira);
        }
    }

    private void validarArquivoBandeira(MultipartFile arquivoBandeira) {
        String nomeOriginal = arquivoBandeira.getOriginalFilename();
        String contentType = arquivoBandeira.getContentType();

        if (!temTexto(nomeOriginal)) {
            throw new RuntimeException("Arquivo de bandeira inválido.");
        }

        String extensao = obterExtensao(nomeOriginal);

        if (!EXTENSOES_PERMITIDAS.contains(extensao)) {
            throw new RuntimeException("Formato de imagem inválido. Use PNG, JPG, JPEG ou WEBP.");
        }

        if (contentType == null || !CONTENT_TYPES_PERMITIDOS.contains(contentType.toLowerCase())) {
            throw new RuntimeException("Tipo de arquivo inválido. Envie uma imagem PNG, JPG, JPEG ou WEBP.");
        }
    }

    private String salvarArquivoBandeira(MultipartFile arquivoBandeira) throws IOException {
        Path diretorio = Path.of(DIRETORIO_UPLOAD_BANDEIRAS);

        if (!Files.exists(diretorio)) {
            Files.createDirectories(diretorio);
        }

        String nomeOriginal = arquivoBandeira.getOriginalFilename();
        String extensao = obterExtensao(nomeOriginal);
        String nomeArquivo = UUID.randomUUID() + extensao;

        Path caminhoDestino = diretorio.resolve(nomeArquivo);

        Files.copy(
                arquivoBandeira.getInputStream(),
                caminhoDestino,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/bandeiras/" + nomeArquivo;
    }

    private String obterExtensao(String nomeArquivo) {
        int indicePonto = nomeArquivo.lastIndexOf(".");

        if (indicePonto < 0) {
            return "";
        }

        return nomeArquivo.substring(indicePonto).toLowerCase();
    }

    private boolean arquivoFoiInformado(MultipartFile arquivoBandeira) {
        return arquivoBandeira != null && !arquivoBandeira.isEmpty();
    }

    private boolean temTexto(String valor) {
        return valor != null && !valor.isBlank();
    }
}