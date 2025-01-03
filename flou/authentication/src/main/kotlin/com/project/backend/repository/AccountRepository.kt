package com.project.backend.repository

import com.project.backend.model.Account
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface AccountRepository: JpaRepository<Account, Long>, JpaSpecificationExecutor<Account>
