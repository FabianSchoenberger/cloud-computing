package com.project.backend.repository.specification

import com.project.backend.model.ToDo
import org.springframework.data.jpa.domain.Specification

object ToDoSpecification {
    fun id(value: Long) = Specification<ToDo> { root, _, builder ->
        val id = root.get<Long>(ToDo::id.name)

        builder.equal(id, value)
    }

    fun accountId(value: Long) = Specification<ToDo> { root, _, builder ->
        val accountId = root.get<Long>(ToDo::accountId.name)

        builder.equal(accountId, value)
    }
}
