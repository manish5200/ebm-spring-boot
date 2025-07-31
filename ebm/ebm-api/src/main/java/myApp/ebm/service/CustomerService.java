package myApp.ebm.service;
import myApp.ebm.model.*;
import myApp.ebm.exception.CustomerNotFoundException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import myApp.ebm.repository.CustomerRepository;

@Service
public class CustomerService {
            
    @Autowired
    private CustomerRepository customerRepo;
    
    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    /**
     * Get customer by consumerId
     */
    public Customer getCustomerByConsumerId(String consumerId) {
        return customerRepo.findByConsumerId(consumerId)
            .orElseThrow(() -> new CustomerNotFoundException(consumerId));
    }

    /**
     * Update customer profile by userId
     */
    @Transactional
    public Customer updateCustomerProfile(Long userId, Customer customerData) {
        Customer customer = customerRepo.findAll().stream()
            .filter(c -> c.getUser() != null && c.getUser().getId().equals(userId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Customer not found for userId: " + userId));
        
        // Update only allowed fields
        if (customerData.getName() != null) {
            customer.setName(customerData.getName());
        }
        if (customerData.getAddress() != null) {
            customer.setAddress(customerData.getAddress());
        }
        if (customerData.getEmail() != null) {
            customer.setEmail(customerData.getEmail());
        }
        if (customerData.getMobile() != null) {
            customer.setMobile(customerData.getMobile());
        }
        if (customerData.getCity() != null) {
            customer.setCity(customerData.getCity());
        }
        if (customerData.getState() != null) {
            customer.setState(customerData.getState());
        }
        if (customerData.getPincode() != null) {
            customer.setPincode(customerData.getPincode());
        }
        
        return customerRepo.save(customer);
    }

    /**
     * Update customer by consumerId
     */
    @Transactional
    public Customer updateCustomer(String consumerId, Customer customerData) {
        Customer customer = customerRepo.findByConsumerId(consumerId)
            .orElseThrow(() -> new CustomerNotFoundException(consumerId));
        
        // Update only allowed fields
        if (customerData.getName() != null) {
            customer.setName(customerData.getName());
        }
        if (customerData.getAddress() != null) {
            customer.setAddress(customerData.getAddress());
        }
        if (customerData.getEmail() != null) {
            customer.setEmail(customerData.getEmail());
        }
        if (customerData.getMobile() != null) {
            customer.setMobile(customerData.getMobile());
        }
        if (customerData.getCity() != null) {
            customer.setCity(customerData.getCity());
        }
        if (customerData.getState() != null) {
            customer.setState(customerData.getState());
        }
        if (customerData.getPincode() != null) {
            customer.setPincode(customerData.getPincode());
        }
        
        return customerRepo.save(customer);
    }

    /**
     * Delete customer by consumerId
     */
    @Transactional
    public void deleteCustomer(String consumerId) {
        Customer customer = customerRepo.findByConsumerId(consumerId)
            .orElseThrow(() -> new CustomerNotFoundException(consumerId));
        customerRepo.delete(customer);
    }
}