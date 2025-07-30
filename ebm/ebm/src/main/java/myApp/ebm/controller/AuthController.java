package myApp.ebm.controller;

import myApp.ebm.dto.LoginRequest;
import myApp.ebm.dto.LoginResponse;
import myApp.ebm.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private LoginService loginService;

    /**
     * Validates login credentials.
     *
     * @param request contains username and password
     * @return 200 OK with userType and userId on success,
     *         401 Unauthorized for invalid credentials,
     *         403 Forbidden if account is inactive
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        LoginResponse response = loginService.validateLogin(request);
        return ResponseEntity.ok(response);
    }
}