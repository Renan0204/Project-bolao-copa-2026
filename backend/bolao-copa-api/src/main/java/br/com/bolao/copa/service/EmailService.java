package br.com.bolao.copa.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.UnsupportedEncodingException;
import java.util.Locale;

@Service
public class EmailService {

    private static final String ASSUNTO_RECUPERACAO_SENHA = "Recuperação de senha - Bolão Copa 2026";
    private static final String TEMPLATE_RECUPERACAO_SENHA = "emails/recuperacao-senha";
    private static final String LOGO_CONTENT_ID = "logoBolao";
    private static final String CAMINHO_LOGO = "static/images/logo-bolao.png";

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.from}")
    private String remetente;

    @Value("${app.mail.from-name:Bolão Copa 2026}")
    private String nomeRemetente;

    @Value("${app.redefinicao-senha-expiracao-minutos:30}")
    private Integer minutosExpiracao;

    public EmailService(JavaMailSender javaMailSender,
                        TemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    public void enviarRecuperacaoSenha(String destinatario,
                                       String nomeUsuario,
                                       String linkRecuperacao) {
        validarDadosEnvio(destinatario, linkRecuperacao);

        try {
            MimeMessage mensagem = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    mensagem,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    "UTF-8"
            );

            helper.setFrom(new InternetAddress(remetente, nomeRemetente));
            helper.setTo(destinatario);
            helper.setSubject(ASSUNTO_RECUPERACAO_SENHA);

            String html = montarHtmlRecuperacaoSenha(nomeUsuario, linkRecuperacao);
            String textoAlternativo = montarTextoAlternativo(nomeUsuario, linkRecuperacao);

            helper.setText(textoAlternativo, html);

            adicionarLogoSeExistir(helper);

            javaMailSender.send(mensagem);
        } catch (MessagingException | UnsupportedEncodingException erro) {
            throw new RuntimeException("Não foi possível montar o e-mail de recuperação de senha.", erro);
        } catch (MailException erro) {
            throw erro;
        }
    }

    private void validarDadosEnvio(String destinatario, String linkRecuperacao) {
        if (!StringUtils.hasText(destinatario)) {
            throw new RuntimeException("Destinatário do e-mail não informado.");
        }

        if (!StringUtils.hasText(remetente)) {
            throw new RuntimeException("Remetente do e-mail não configurado.");
        }

        if (!StringUtils.hasText(linkRecuperacao)) {
            throw new RuntimeException("Link de recuperação de senha não informado.");
        }
    }

    private String montarHtmlRecuperacaoSenha(String nomeUsuario, String linkRecuperacao) {
        Context contexto = new Context(new Locale("pt", "BR"));

        contexto.setVariable("nomeUsuario", tratarNome(nomeUsuario));
        contexto.setVariable("linkRecuperacao", linkRecuperacao);
        contexto.setVariable("minutosExpiracao", minutosExpiracao);

        return templateEngine.process(TEMPLATE_RECUPERACAO_SENHA, contexto);
    }

    private String montarTextoAlternativo(String nomeUsuario, String linkRecuperacao) {
        String nome = tratarNome(nomeUsuario);

        return "Olá, " + nome + "!\n\n"
                + "Recebemos uma solicitação para redefinir a senha da sua conta no Bolão Copa 2026.\n\n"
                + "Acesse o link abaixo para criar uma nova senha:\n"
                + linkRecuperacao + "\n\n"
                + "Este link expira em " + minutosExpiracao + " minutos.\n\n"
                + "Se você não solicitou essa alteração, ignore este e-mail. Sua senha atual continuará a mesma.\n\n"
                + "Atenciosamente,\n"
                + "Equipe Bolão Copa 2026";
    }

    private void adicionarLogoSeExistir(MimeMessageHelper helper) throws MessagingException {
        ClassPathResource logo = new ClassPathResource(CAMINHO_LOGO);

        if (logo.exists()) {
            helper.addInline(LOGO_CONTENT_ID, logo);
        }
    }

    private String tratarNome(String nomeUsuario) {
        if (!StringUtils.hasText(nomeUsuario)) {
            return "usuário";
        }

        return nomeUsuario.trim();
    }
}