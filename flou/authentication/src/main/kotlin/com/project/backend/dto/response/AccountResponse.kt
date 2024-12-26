package com.project.backend.dto.response

import com.project.backend.model.Account

class AccountResponse(
    val id: Long,
    val username: String
)

fun Account.toResponse() = AccountResponse(id, username)
