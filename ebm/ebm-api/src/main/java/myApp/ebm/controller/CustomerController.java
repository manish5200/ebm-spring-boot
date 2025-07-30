package myApp.ebm.controller;

import myApp.ebm.dto.CustomerRegistrationRequest;
import myApp.ebm.dto.MessageResponse;
import myApp.ebm.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private myApp.ebm.service.CustomerService customerService;

    /**
     * Registers a new customer.
     *
     * @param request contains consumerId, username, name, email, mobile, address, password
     * @return 201 Created on success, 409 Conflict if email already exists
     */
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerCustomer(
            @RequestBody CustomerRegistrationRequest request) {

        registrationService.registerCustomer(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MessageResponse("Customer registered successfully"));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<MessageResponse> updateCustomerProfile(
            @PathVariable Long userId,
            @RequestBody CustomerRegistrationRequest request) {
        customerService.updateCustomerProfile(
            userId,
            request.getName(),
            request.getAddress(),
            request.getCity(),
            request.getState(),
            request.getPincode(),
            request.getMobile()
        );
        return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
    }

    /**
     * Delete a customer (admin only)
     */
    @DeleteMapping("/{consumerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String consumerId) {
        customerService.deleteCustomerByConsumerId(consumerId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}