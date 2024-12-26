package com.project.backend.dto.response

import com.project.backend.model.Session

class SessionResponse(
    val id: Long
)

fun Session.toResponse() = SessionResponse(
    id = id
)
