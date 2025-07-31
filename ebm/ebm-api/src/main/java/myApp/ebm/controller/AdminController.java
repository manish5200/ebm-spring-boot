package myApp.ebm.controller;

import myApp.ebm.dto.AdminRegistrationRequest;
import myApp.ebm.dto.MessageResponse;
import myApp.ebm.model.Customer;
import myApp.ebm.model.User;
import myApp.ebm.service.CustomerService;
import myApp.ebm.service.RegistrationService;
import myApp.ebm.service.UserService;

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
    @Autowired
    private UserService userService;

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

    /**
     * Get all customers
     */
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    /**
     * Get all users (admin and customers)
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Update user profile
     */
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User userData) {
        User updatedUser = userService.updateUser(userId, userData);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Delete user
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}