package com.project.backend.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("com.project.cookie")
data class CookieProperties(
    val domain: String,
    val path: String,
    val ssl: Boolean
)
