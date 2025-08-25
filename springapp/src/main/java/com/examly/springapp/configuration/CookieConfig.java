package com.examly.springapp.configuration;
import org.springframework.boot.web.servlet.server.CookieSameSiteSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CookieConfig {

    @Bean
    public CookieSameSiteSupplier applicationCookieSameSiteSupplier() {
        // Forces SameSite=None for ALL cookies, works with HTTPS
        return CookieSameSiteSupplier.ofNone();
    }
}
