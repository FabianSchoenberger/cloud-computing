package com.project.backend.security

import com.project.backend.repository.SessionRepository
import com.project.backend.repository.specification.SessionSpecification
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component

@Component
class AuthProvider(
    private val sessionRepository: SessionRepository
) : AuthenticationProvider {
    override fun authenticate(authentication: Authentication): Authentication {
        val auth = authentication as Auth

        val session = sessionRepository.findOne(
            SessionSpecification.token(auth.credentials)
        ).orElseThrow { BadCredentialsException("") }

        return Auth(
            account = session.account,
            token = auth.credentials
        )
    }

    override fun supports(authentication: Class<*>): Boolean {
        return Auth::class.java.isAssignableFrom(authentication)
    }
}
