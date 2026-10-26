package com.talenttrack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        File curDir = new File(".");
        String absPath = curDir.getAbsolutePath();
        if (absPath.endsWith(".")) {
            absPath = absPath.substring(0, absPath.length() - 1);
        }
        String fileLocation = "file:" + absPath.replace("\\", "/");
        if (!fileLocation.endsWith("/")) {
            fileLocation += "/";
        }

        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/", "classpath:/public/", fileLocation);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}
