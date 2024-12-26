package com.project.backend.repository

import com.project.backend.model.Session
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface SessionRepository : JpaRepository<Session, Long>, JpaSpecificationExecutor<Session>
