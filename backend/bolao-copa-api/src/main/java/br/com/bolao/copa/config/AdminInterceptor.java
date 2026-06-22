package br.com.bolao.copa.config;

import br.com.bolao.copa.controller.AdminLoginController;
import br.com.bolao.copa.model.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        Usuario adminLogado = (Usuario) request.getSession()
                .getAttribute(AdminLoginController.ADMIN_LOGADO);

        if (adminLogado == null) {
            response.sendRedirect("/admin/login");
            return false;
        }

        if (!"ADMIN".equalsIgnoreCase(adminLogado.getTipo())) {
            request.getSession().invalidate();
            response.sendRedirect("/admin/login");
            return false;
        }

        if (Boolean.TRUE.equals(adminLogado.getBloqueado())) {
            request.getSession().invalidate();
            response.sendRedirect("/admin/login");
            return false;
        }

        return true;
    }
}