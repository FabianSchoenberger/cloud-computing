package com.project.backend.dto.request

import com.project.backend.dto.request.validation.annotation.Password
import com.project.backend.dto.request.validation.annotation.Username

class CreateAccountRequest(
    @Username val username: String,
    @Password val password: String
)