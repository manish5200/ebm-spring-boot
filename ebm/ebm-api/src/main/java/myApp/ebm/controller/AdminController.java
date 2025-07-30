package myApp.ebm.controller;

import myApp.ebm.dto.AdminRegistrationRequest;
import myApp.ebm.dto.MessageResponse;
import myApp.ebm.model.Customer;
import myApp.ebm.service.CustomerService;
import myApp.ebm.service.RegistrationService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private RegistrationService registrationService;
    @Autowired
    private CustomerService customerService;

    /**
     * Registers a new administrator.
     *
     * @param request contains username, email, password
     * @return 201 Created on success, 409 Conflict if email already exists
     */
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerAdmin(
            @RequestBody AdminRegistrationRequest request) {

        registrationService.registerAdmin(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MessageResponse("Administrator registered successfully"));
    }
     @GetMapping("/customers")
     public ResponseEntity<List<Customer>>getAllCustomers(){
    	       List<Customer>customers=customerService.getAllCustomers();
    	       return ResponseEntity.ok(customers);
     }
}