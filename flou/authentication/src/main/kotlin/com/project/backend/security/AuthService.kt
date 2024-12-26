package com.project.backend.security

import com.project.backend.config.CookieProperties
import com.project.backend.model.Account
import com.project.backend.model.Session
import com.project.backend.repository.SessionRepository
import com.project.backend.repository.specification.SessionSpecification
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseCookie
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class AuthService(
    val cookieProperties: CookieProperties,
    val response: HttpServletResponse,
    val sessionRepository: SessionRepository
) {
    private val auth: Auth?
        get() = SecurityContextHolder.getContext().authentication as? Auth

    val account: Account
        get() = auth!!.principal

    private val token: String
        get() = auth!!.credentials

    val session: Session
        get() = sessionRepository.findOne(
            SessionSpecification.token(token)
        ).get()

    fun isAuthenticated(): Boolean {
        return auth?.isAuthenticated ?: false
    }

    fun setCookie(token: String = auth!!.credentials) {
        val cookie = getCookie(token, 60 * 60 * 24 * 7)
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString())
    }

    fun resetCookie() {
        val cookie = getCookie("", 0)
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString())
    }

    private fun getCookie(token: String, maxAge: Long): ResponseCookie {
        return ResponseCookie.from("AUTH", token)
            .maxAge(maxAge)
            .domain(cookieProperties.domain)
            .path(cookieProperties.path)
            .secure(cookieProperties.ssl)
            .httpOnly(true)
            .sameSite("Strict")
            .build()
    }
}
