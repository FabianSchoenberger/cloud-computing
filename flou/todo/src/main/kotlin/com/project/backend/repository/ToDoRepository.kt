package com.project.backend.repository

import com.project.backend.model.ToDo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface ToDoRepository : JpaRepository<ToDo, Long>, JpaSpecificationExecutor<ToDo>
