package com.project.backend.dto.request.validation

import org.springframework.http.HttpStatus
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.server.ResponseStatusException

@ControllerAdvice
class ValidationAdvice {
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(exception: MethodArgumentNotValidException) {
        throw ResponseStatusException(HttpStatus.BAD_REQUEST)
    }
}
