package com.project.backend.controller

import com.project.backend.dto.request.CreateToDoRequest
import com.project.backend.dto.request.UpdateToDoRequest
import com.project.backend.dto.response.ToDoResponse
import com.project.backend.service.ToDoService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/todo")
@Tag(name = "todo")
class ToDoController(
    private val toDoService: ToDoService
) {
    @GetMapping
    @Operation(
        security = [SecurityRequirement(name = "auth")],
        responses = [
            ApiResponse(
                responseCode = "200", description = "Success",
                content = [Content(
                    mediaType = "application/json",
                    array = ArraySchema(schema = Schema(implementation = ToDoResponse::class))
                )]
            ),
            ApiResponse(responseCode = "401", description = "Not Authenticated", content = [Content()])
        ]
    )
    fun get() = toDoService.get()

    @PostMapping
    @Operation(
        security = [SecurityRequirement(name = "auth")],
        responses = [
            ApiResponse(
                responseCode = "200", description = "Success",
                content = [Content(
                    mediaType = "application/json",
                   schema = Schema(implementation = ToDoResponse::class)
                )]
            ),
            ApiResponse(responseCode = "401", description = "Not Authenticated", content = [Content()]),
            ApiResponse(responseCode = "403", description = "Not Allowed", content = [Content()]),
            ApiResponse(responseCode = "404", description = "Not Found", content = [Content()])
        ]
    )
    fun create(@RequestBody request: CreateToDoRequest) = toDoService.create(request)

    @PutMapping
    @Operation(
        security = [SecurityRequirement(name = "auth")],
        responses = [
            ApiResponse(
                responseCode = "200", description = "Success",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ToDoResponse::class)
                )]
            ),
            ApiResponse(responseCode = "401", description = "Not Authenticated", content = [Content()]),
            ApiResponse(responseCode = "403", description = "Not Allowed", content = [Content()]),
            ApiResponse(responseCode = "404", description = "Not Found", content = [Content()])
        ]
    )
    fun create(@RequestBody request: UpdateToDoRequest) = toDoService.update(request)

    @DeleteMapping("{id}")
    @Operation(
        security = [SecurityRequirement(name = "auth")],
        responses = [
            ApiResponse(
                responseCode = "200", description = "Success",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = ToDoResponse::class)
                )]
            ),
            ApiResponse(responseCode = "401", description = "Not Authenticated", content = [Content()]),
            ApiResponse(responseCode = "403", description = "Not Allowed", content = [Content()]),
            ApiResponse(responseCode = "404", description = "Not Found", content = [Content()])
        ]
    )
    fun create(@PathVariable id: Long) = toDoService.delete(id)
}
