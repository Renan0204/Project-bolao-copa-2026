package br.com.bolao.copa.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${app.mail.from}")
    private String remetente;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void enviarRecuperacaoSenha(String destinatario, String nomeUsuario, String linkRecuperacao) {
        if (!StringUtils.hasText(destinatario)) {
            throw new RuntimeException("Destinatário do e-mail não informado.");
        }

        if (!StringUtils.hasText(remetente)) {
            throw new RuntimeException("Remetente do e-mail não configurado.");
        }

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setFrom(remetente);
        mensagem.setTo(destinatario);
        mensagem.setSubject("Recuperação de senha - Bolão Copa 2026");
        mensagem.setText(montarMensagem(nomeUsuario, linkRecuperacao));

        javaMailSender.send(mensagem);
    }

    private String montarMensagem(String nomeUsuario, String linkRecuperacao) {
        String nome = StringUtils.hasText(nomeUsuario) ? nomeUsuario : "usuário";

        return "Olá, " + nome + "!\n\n"
                + "Recebemos uma solicitação para redefinir a senha da sua conta no Bolão Copa 2026.\n\n"
                + "Clique no link abaixo para criar uma nova senha:\n"
                + linkRecuperacao + "\n\n"
                + "Este link expira em 30 minutos.\n\n"
                + "Se você não solicitou essa alteração, ignore este e-mail.\n\n"
                + "Atenciosamente,\n"
                + "Equipe Bolão Copa 2026";
    }
}