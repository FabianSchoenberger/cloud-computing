package com.project.backend.controller

import com.project.backend.dto.request.CreateSessionRequest
import com.project.backend.dto.response.SessionResponse
import com.project.backend.service.SessionService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("session")
@Tag(name = "session")
class SessionController(
    private val sessionService: SessionService
) {
    @GetMapping
    @Operation(
        security = [SecurityRequirement(name = "auth")],
        responses = [
            ApiResponse(
                responseCode = "200", description = "Success",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = SessionResponse::class))]
            ),
            ApiResponse(responseCode = "401", description = "Not Authenticated", content = [Content()])
        ]
    )
    fun get() = sessionService.get()

    @PostMapping
    @Operation(
        security = [],
        responses = [
            ApiResponse(responseCode = "200", description = "Success", content = [Content()]),
            ApiResponse(responseCode = "401", description = "Unauthorized", content = [Content()]),
            ApiResponse(responseCode = "404", description = "Not Found", content = [Content()])
        ]
    )
    fun create(
        @Valid @RequestBody request: CreateSessionRequest
    ) = sessionService.create(request)

    @DeleteMapping
    @Operation(
        security = [SecurityRequirement(name = "auth")],
        responses = [
            ApiResponse(responseCode = "200", description = "Success", content = [Content()]),
            ApiResponse(responseCode = "401", description = "Unauthorized", content = [Content()])
        ]
    )
    fun delete() = sessionService.delete()
}