package com.project.backend.service

import com.project.backend.dto.request.CreateAccountRequest
import com.project.backend.dto.response.AccountResponse
import com.project.backend.dto.response.toResponse
import com.project.backend.service.exception.ConflictException
import com.project.backend.model.Account
import com.project.backend.repository.AccountRepository
import com.project.backend.repository.specification.AccountSpecification
import com.project.backend.security.AuthService
import com.project.backend.security.annotation.Authenticated
import org.springframework.security.crypto.bcrypt.BCrypt
import org.springframework.stereotype.Service

@Service
class AccountService(
    private val authService: AuthService,
    private val accountRepository: AccountRepository
) {
    @Authenticated
    fun get(): AccountResponse {
        return authService.account.toResponse()
    }

    fun create(request: CreateAccountRequest) {
        if (
            accountRepository.exists(
                AccountSpecification.username(request.username)
            )
        ) throw ConflictException()

        Account(
            username = request.username,
            passwordHash = BCrypt.hashpw(request.password, BCrypt.gensalt())
        ).let { accountRepository.save(it) }
    }
}