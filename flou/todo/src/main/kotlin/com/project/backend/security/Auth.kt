package com.project.backend.security

import org.springframework.security.authentication.AbstractAuthenticationToken

class Auth : AbstractAuthenticationToken {
    private val account: Account?
    private val token: String

    constructor(account: Account, token: String) : super(null) {
        this.account = account
        this.token = token

        isAuthenticated = true
    }

    constructor(token: String) : super(null) {
        this.account = null
        this.token = token

        isAuthenticated = false
    }

    override fun getPrincipal(): Account {
        return account!!
    }

    override fun getCredentials(): String {
        return token
    }
}
