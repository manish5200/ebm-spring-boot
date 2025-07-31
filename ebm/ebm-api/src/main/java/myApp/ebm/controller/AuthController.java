package myApp.ebm.controller;

import myApp.ebm.dto.AdminRegistrationRequest;
import myApp.ebm.dto.CustomerRegistrationRequest;
import myApp.ebm.dto.LoginRequest;
import myApp.ebm.dto.LoginResponse;
import myApp.ebm.dto.MessageResponse;
import myApp.ebm.service.LoginService;
import myApp.ebm.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private LoginService loginService;
    
    @Autowired
    private RegistrationService registrationService;

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

    /**
     * Registers a new customer.
     * 
     * @param request contains customer registration details
     * @return 201 Created on success, 409 Conflict if email already exists
     */
    @PostMapping("/register/customer")
    public ResponseEntity<MessageResponse> registerCustomer(
            @RequestBody CustomerRegistrationRequest request) {

        registrationService.registerCustomer(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MessageResponse("Customer registered successfully"));
    }

    /**
     * Registers a new administrator.
     * 
     * @param request contains admin registration details
     * @return 201 Created on success, 409 Conflict if email already exists
     */
    @PostMapping("/register/admin")
    public ResponseEntity<MessageResponse> registerAdmin(
            @RequestBody AdminRegistrationRequest request) {

        registrationService.registerAdmin(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MessageResponse("Administrator registered successfully"));
    }
}