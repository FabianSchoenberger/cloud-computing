package com.project.backend.config

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableConfigurationProperties(CookieProperties::class)
class Configuration: WebMvcConfigurer {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.cors { it.disable() }
        http.csrf { it.disable() }
        http.exceptionHandling {
            it.authenticationEntryPoint { _, response, _ -> response.sendError(HttpStatus.UNAUTHORIZED.value()) }
        }
        return http.build()
    }

    @Bean
    fun authenticationManager(authenticationConfiguration: AuthenticationConfiguration): AuthenticationManager {
        return authenticationConfiguration.authenticationManager
    }
}
