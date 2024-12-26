package com.project.backend.repository.specification

import com.project.backend.model.Session
import com.project.backend.util.Hasher
import org.springframework.data.jpa.domain.Specification

object SessionSpecification {
    fun id(value: Long) = Specification<Session> { root, _, builder ->
        val id = root.get<Long>(Session::id.name)

        builder.equal(id, value)
    }

    fun token(value: String) = Specification<Session> { root, _, builder ->
        val tokenHash = root.get<String>(Session::tokenHash.name)

        builder.equal(tokenHash, Hasher.hash(value))
    }
}
