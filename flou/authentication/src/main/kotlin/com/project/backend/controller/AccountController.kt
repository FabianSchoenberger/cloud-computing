package com.project.backend.controller

import com.project.backend.dto.request.CreateAccountRequest
import com.project.backend.dto.response.AccountResponse
import com.project.backend.service.AccountService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("account")
@Tag(name = "account")
class AccountController(
    private val accountService: AccountService
) {
    @GetMapping
    @Operation(
        security = [SecurityRequirement(name = "auth")],
        responses = [
            ApiResponse(
                responseCode = "200", description = "Success",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = AccountResponse::class))]
            ),
            ApiResponse(responseCode = "401", description = "Not Authenticated", content = [Content()])
        ]
    )
    fun get() = accountService.get()

    @PostMapping
    @Operation(
        security = [],
        responses = [
            ApiResponse(responseCode = "200", description = "Success", content = [Content()]),
            ApiResponse(responseCode = "400", description = "Bad Request", content = [Content()]),
            ApiResponse(responseCode = "406", description = "Conflict", content = [Content()])
        ]
    )
    fun create(
        @Valid @RequestBody request: CreateAccountRequest
    ) = accountService.create(request)
}