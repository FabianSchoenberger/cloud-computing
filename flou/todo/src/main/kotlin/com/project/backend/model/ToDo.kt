package com.project.backend.model

import jakarta.persistence.*

@Entity(name = "todo")
class ToDo(
    @Column(nullable = false)
    val accountId: Long,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false)
    var done: Boolean = false,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
