package com.project.backend.service

import com.project.backend.dto.request.CreateToDoRequest
import com.project.backend.dto.request.UpdateToDoRequest
import com.project.backend.dto.response.ToDoResponse
import com.project.backend.dto.response.toResponse
import com.project.backend.model.ToDo
import com.project.backend.repository.ToDoRepository
import com.project.backend.repository.specification.ToDoSpecification
import com.project.backend.security.AuthService
import com.project.backend.security.annotation.Authenticated
import com.project.backend.service.exception.ForbiddenException
import com.project.backend.service.exception.NotFoundException
import org.springframework.stereotype.Service

@Service
class ToDoService(
    private val authService: AuthService,
    private val toDoRepository: ToDoRepository
) {
    @Authenticated
    fun get(): List<ToDoResponse> {
        val account = authService.account

        val todos = toDoRepository.findAll(ToDoSpecification.accountId(account.id))

        return todos.map { it.toResponse() }
    }

    @Authenticated
    fun create(request: CreateToDoRequest): ToDoResponse {
        val account = authService.account

        val todo = toDoRepository.save(ToDo(accountId = account.id, name = request.name));

        return todo.toResponse();
    }

    @Authenticated
    fun update(request: UpdateToDoRequest): ToDoResponse {
        val account = authService.account

        val todo = toDoRepository.findOne(ToDoSpecification.id(request.id))
            .orElseThrow { NotFoundException() }

        if (todo.accountId != account.id) {
            throw ForbiddenException()
        }

        val todoResponse = toDoRepository.save(todo.apply { done = request.done });

        return todoResponse.toResponse();
    }

    @Authenticated
    fun delete(id: Long) : ToDoResponse {
        val account = authService.account

        val todo = toDoRepository.findOne(ToDoSpecification.id(id))
            .orElseThrow { NotFoundException() }

        if (todo.accountId != account.id) {
            throw ForbiddenException()
        }

        toDoRepository.delete(todo)

        return todo.toResponse();
    }
}