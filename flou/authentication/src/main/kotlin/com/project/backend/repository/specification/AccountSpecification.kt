package com.project.backend.repository.specification

import com.project.backend.model.Account
import org.springframework.data.jpa.domain.Specification

object AccountSpecification {
    fun id(value: Long) = Specification<Account> { root, _, builder ->
        val id = root.get<Long>(Account::id.name)

        builder.equal(id, value)
    }

    fun username(value: String) = Specification<Account> { root, _, builder ->
        val username = root.get<Long>(Account::username.name)

        builder.equal(username, value)
    }
}