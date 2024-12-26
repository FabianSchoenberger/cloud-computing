package com.project.backend.model

import jakarta.persistence.*

@Entity
class Session(
    @Column(nullable = false)
    val tokenHash: String,

    @ManyToOne(optional = false)
    val account: Account
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
