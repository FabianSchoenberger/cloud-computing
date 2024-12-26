package com.project.backend.dto.request.validation.annotation

import com.project.backend.dto.request.validation.validator.PasswordValidator
import com.project.backend.dto.request.validation.validator.UsernameValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Constraint(validatedBy = [PasswordValidator::class])
@Target(AnnotationTarget.PROPERTY)
annotation class Password(
    val message: String = "",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = [],
)

