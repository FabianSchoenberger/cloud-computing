package com.project.backend.dto.request.validation.validator

import com.project.backend.dto.request.validation.annotation.Password
import com.project.backend.dto.request.validation.annotation.Username
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class PasswordValidator : ConstraintValidator<Password, String> {
    override fun isValid(value: String, context: ConstraintValidatorContext): Boolean {
        val regex = """^(?=.{8,}$)[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]*$""".toRegex()

        return regex matches value
    }
}
