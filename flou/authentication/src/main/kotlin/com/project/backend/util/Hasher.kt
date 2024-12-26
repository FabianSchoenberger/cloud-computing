package com.project.backend.util

import org.springframework.security.crypto.codec.Hex
import java.security.MessageDigest

object Hasher {
    private val digest = MessageDigest.getInstance("SHA-256")

    fun hash(string: String): String {
        return Hex.encode(
            digest.digest(string.toByteArray(Charsets.UTF_8))
        ).joinToString("")
    }
}
