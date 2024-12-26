package com.project.backend.dto.response

import com.project.backend.model.ToDo

class ToDoResponse(
    val id: Long,
    val name: String,
    val done: Boolean
)

fun ToDo.toResponse(): ToDoResponse {
    return ToDoResponse(
        this.id,
        this.name,
        this.done
    )
}
