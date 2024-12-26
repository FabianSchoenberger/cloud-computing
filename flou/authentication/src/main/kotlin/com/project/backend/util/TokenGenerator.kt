package com.project.backend.util

import org.springframework.security.crypto.codec.Hex
import java.security.SecureRandom

object TokenGenerator {
    private val secureRandom = SecureRandom()

    fun generate(): String {
        return Hex.encode(
            ByteArray(32).also { secureRandom.nextBytes(it) }
        ).joinToString("")
    }
}
