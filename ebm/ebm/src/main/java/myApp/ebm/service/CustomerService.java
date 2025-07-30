package myApp.ebm.service;
import myApp.ebm.model.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import myApp.ebm.repository.CustomerRepository;

@Service
public class CustomerService {
            
	       @Autowired
	       private CustomerRepository customerRepo;
	      public List<Customer>getAllCustomers(){
	    	   return customerRepo.findAll();
	      }
	      
	      public Customer updateCustomerProfile(Long userId, String name, String address, String city, String state, String pincode, String mobile) {
	    	    Customer customer = customerRepo.findAll().stream()
	    	        .filter(c -> c.getUser() != null && c.getUser().getId().equals(userId))
	    	        .findFirst()
	    	        .orElseThrow(() -> new RuntimeException("Customer not found for userId: " + userId));
	    	    customer.setName(name);
	    	    customer.setAddress(address);
	    	    customer.setCity(city);
	    	    customer.setState(state);
	    	    customer.setPincode(pincode);
	    	    customer.setMobile(mobile);
	    	    return customerRepo.save(customer);
	    	}
	      
	      public void deleteCustomerByConsumerId(String consumerId) {
	          Customer customer = customerRepo.findByConsumerId(consumerId)
	              .orElseThrow(() -> new RuntimeException("Customer not found for consumerId: " + consumerId));
	          customerRepo.delete(customer);
	      }
}
