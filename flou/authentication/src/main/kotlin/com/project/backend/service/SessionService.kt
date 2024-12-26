package com.project.backend.service

import com.project.backend.dto.request.CreateSessionRequest
import com.project.backend.dto.response.SessionResponse
import com.project.backend.dto.response.toResponse
import com.project.backend.model.Session
import com.project.backend.repository.AccountRepository
import com.project.backend.repository.SessionRepository
import com.project.backend.repository.specification.AccountSpecification
import com.project.backend.security.AuthService
import com.project.backend.security.annotation.Authenticated
import com.project.backend.service.exception.NotFoundException
import com.project.backend.service.exception.UnauthorizedException
import com.project.backend.util.Hasher
import com.project.backend.util.TokenGenerator
import org.springframework.security.crypto.bcrypt.BCrypt
import org.springframework.stereotype.Service

@Service
class SessionService(
    private val authService: AuthService,
    private val accountRepository: AccountRepository,
    private val sessionRepository: SessionRepository
) {
    @Authenticated
    fun get(): SessionResponse {
        return authService.session.toResponse()
    }

    fun create(request: CreateSessionRequest) {
        val account = accountRepository.findOne(
            AccountSpecification.username(request.username)
        ).orElseThrow { NotFoundException() }

        if (!BCrypt.checkpw(request.password, account.passwordHash))
            throw UnauthorizedException()

        val token = TokenGenerator.generate()

        Session(
            account = account,
            tokenHash = Hasher.hash(token)
        ).let { sessionRepository.save(it) }

        authService.setCookie(token)
    }

    @Authenticated
    fun delete() {
        val session = authService.session
        sessionRepository.delete(session)

        authService.resetCookie()
    }
}