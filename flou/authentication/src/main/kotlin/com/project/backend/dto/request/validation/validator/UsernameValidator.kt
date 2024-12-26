package com.project.backend.dto.request.validation.validator

import com.project.backend.dto.request.validation.annotation.Username
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class UsernameValidator : ConstraintValidator<Username, String> {
    override fun isValid(value: String, context: ConstraintValidatorContext): Boolean {
        val regex = """^(?=.{1,32}$)[a-z0-9]+([\-._][a-z0-9]+)*$""".toRegex()

        return regex matches value
    }
}
