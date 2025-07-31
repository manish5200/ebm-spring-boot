package myApp.ebm.controller;

import myApp.ebm.dto.CustomerRegistrationRequest;
import myApp.ebm.dto.MessageResponse;
import myApp.ebm.model.Customer;
import myApp.ebm.service.CustomerService;
import myApp.ebm.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private RegistrationService registrationService;
    @Autowired
    private CustomerService customerService;

    /**
     * Registers a new customer.
     */
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerCustomer(
            @RequestBody CustomerRegistrationRequest request) {

        registrationService.registerCustomer(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MessageResponse("Customer registered successfully"));
    }

    /**
     * Update customer profile
     */
    @PutMapping("/profile/{userId}")
    public ResponseEntity<Customer> updateCustomerProfile(
            @PathVariable Long userId,
            @RequestBody Customer customerData) {
        
        Customer updatedCustomer = customerService.updateCustomerProfile(userId, customerData);
        return ResponseEntity.ok(updatedCustomer);
    }

    /**
     * Get customer by ID
     */
    @GetMapping("/{consumerId}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable String consumerId) {
        Customer customer = customerService.getCustomerByConsumerId(consumerId);
        return ResponseEntity.ok(customer);
    }

    /**
     * Update customer by consumerId
     */
    @PutMapping("/{consumerId}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable String consumerId,
            @RequestBody Customer customerData) {
        
        Customer updatedCustomer = customerService.updateCustomer(consumerId, customerData);
        return ResponseEntity.ok(updatedCustomer);
    }

    /**
     * Delete customer by consumerId
     */
    @DeleteMapping("/{consumerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String consumerId) {
        customerService.deleteCustomer(consumerId);
        return ResponseEntity.noContent().build();
    }
}