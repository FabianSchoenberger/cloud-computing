package com.project.backend.security

import com.project.backend.config.AuthProperties
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForEntity

val rt = RestTemplate()

@Component
class AuthProvider(
    val authProperties: AuthProperties
) : AuthenticationProvider {
    override fun authenticate(authentication: Authentication): Authentication {
        val auth = authentication as Auth

        val headers = HttpHeaders()
        headers.add("Cookie", "AUTH=${authentication.credentials}")
        val entity = HttpEntity<Unit>(headers)
        val response = rt.exchange<Account>(authProperties.url("account"), HttpMethod.GET, entity, Account::class.java)

        if(response.statusCode == HttpStatus.UNAUTHORIZED)
            throw BadCredentialsException("")

        val account = response.body!!

        return Auth(
            account = account,
            token = auth.credentials
        )
    }

    override fun supports(authentication: Class<*>): Boolean {
        return Auth::class.java.isAssignableFrom(authentication)
    }
}
