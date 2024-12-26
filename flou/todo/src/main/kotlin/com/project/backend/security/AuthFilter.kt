package com.project.backend.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.util.WebUtils
import javax.naming.AuthenticationException

@Component
class AuthFilter(
    private val authenticationManager: AuthenticationManager,
    private val authService: AuthService
) : OncePerRequestFilter() {
    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {
        val token = WebUtils.getCookie(request, "AUTH")?.value

        token?.also {
            try {
                SecurityContextHolder.getContext().authentication = authenticationManager.authenticate(Auth(it))
                authService.setCookie()
            } catch (_: AuthenticationException) {
            }
        }

        filterChain.doFilter(request, response)
    }
}
