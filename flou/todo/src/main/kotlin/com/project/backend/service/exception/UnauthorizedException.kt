package com.project.backend.service.exception

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

class UnauthorizedException : ResponseStatusException(HttpStatus.UNAUTHORIZED)
