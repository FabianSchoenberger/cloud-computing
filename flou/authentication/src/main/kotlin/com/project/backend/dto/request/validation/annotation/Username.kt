package com.project.backend.dto.request.validation.annotation

import com.project.backend.dto.request.validation.validator.UsernameValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Constraint(validatedBy = [UsernameValidator::class])
@Target(AnnotationTarget.PROPERTY)
annotation class Username(
    val message: String = "",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = [],
)

