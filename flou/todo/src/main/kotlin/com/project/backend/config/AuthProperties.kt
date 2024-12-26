package com.project.backend.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("com.project.auth")
data class AuthProperties(
    val host: String,
    val port: String
) {
    fun url(path: String = "") = "$host:$port/$path"
}
