package br.com.bolao.copa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final AdminInterceptor adminInterceptor;

    public WebMvcConfig(AdminInterceptor adminInterceptor) {
        this.adminInterceptor = adminInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminInterceptor)
                .addPathPatterns(
                        "/dashboard/**",
                        "/selecoes/**",
                        "/estadios/**",
                        "/partidas/**",
                        "/resultados/**",
                        "/usuarios-admin/**"
                )
                .excludePathPatterns(
                        "/admin/login",
                        "/admin/recuperar-senha",
                        "/admin/logout",
                        "/redefinir-senha",
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/uploads/**",
                        "/api/**"
                );
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}