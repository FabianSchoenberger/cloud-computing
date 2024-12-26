package com.project.backend.model

import jakarta.persistence.*

@Entity
class Account(
    @Column(unique = true, nullable = false)
    var username: String,

    @Column(nullable = false)
    var passwordHash: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}