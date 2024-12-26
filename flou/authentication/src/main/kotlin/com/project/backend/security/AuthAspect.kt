package com.project.backend.security

import com.project.backend.security.annotation.Authenticated
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Component

@Aspect
@Component
class AuthAspect(
    private val authService: AuthService
) {
    @Before("@annotation(it)")
    fun authenticated(it: Authenticated) {
        if (!authService.isAuthenticated())
            throw AccessDeniedException("")
    }
}
