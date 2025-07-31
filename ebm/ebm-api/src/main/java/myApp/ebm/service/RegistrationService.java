package myApp.ebm.service;
import myApp.ebm.model.*;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import myApp.ebm.dto.AdminRegistrationRequest;
import myApp.ebm.dto.CustomerRegistrationRequest;
import myApp.ebm.exception.*;
import myApp.ebm.repository.*;

import myApp.ebm.util.EncryptionUtil;

/** 
 *  Service handling both customer and admin registration 
 **/

@Service
public class RegistrationService {
             @Autowired
	         private UserRepository userRepo;
             @Autowired
             private CustomerRepository customerRepo;
             
             @Autowired
             private RoleRepository roleRepo;
             
             /**
              * Registers a new customer account.
              *
              * @param req must contain consumerId, username, name, email, mobile, address, password
              * @throws EmailAlreadyExistsException if email already in use
              * @throws RegistrationException       for any other failure
              */
              @Transactional
              
              public void registerCustomer(CustomerRegistrationRequest req) {
            	         //1.  Duplicate - email check 
            	     
            	    if(userRepo.existsByEmail(req.getEmail())){
            	    	  throw new EmailAlreadyExistsException(req.getEmail());
            	    }
            	    
            	    try {
            	    	//2. Create User(login) record
            	    	
            	    	User user  = new User();
            	    	
            	    	user.setUsername(req.getUsername());
            	    	user.setEmail(req.getEmail());
            	    	user.setName(req.getName());
            	    	user.setPassword(EncryptionUtil.encrypt(req.getPassword()));
            	    	user.setStatus("ACTIVE");
            	    	user.setUserType("CUSTOMER");
            	    	
            	    	//3. Assign ROLE_CUSTOMER
            	    	Role customerRole = roleRepo.findByName(ERole.ROLE_CUSTOMER)
            	    			                        .orElseThrow(() -> 
            	    			                        new RegistrationException("ROLE_CUSTOMER not configured",null));
            	    	user.setRoles(Collections.singleton(customerRole));
            	    	
            	    	//4. Create Customer
            	    	
            	    	Customer cust = new Customer();
            	    	cust.setConsumerId(req.getConsumerId());
            	    	cust.setName(req.getName());
            	    	cust.setAddress(req.getAddress());
            	    	cust.setEmail(req.getEmail());
            	    	cust.setMobile(req.getMobile());
            	    	cust.setCity(req.getCity());
            	    	cust.setState(req.getState());
            	    	cust.setPincode(req.getPincode());
            	    	 cust.setUser(user);
            	    	   
            	    	   //5. Persist both (cascade ALL on customer -> User)
            	    	   
            	    	   customerRepo.save(cust);
            	    }catch(EmailAlreadyExistsException e) {
            	    	 throw e; // duplicate email
            	    }catch(Exception e) {
            	    	throw new RegistrationException("Failed to register customer",e);
            	    }
              }
              
              /**
               * Registers a new administrator account programmatically.
               *
               * @param req must contain username, email, password
               * @throws EmailAlreadyExistsException if email already in use
               * @throws RegistrationException       for any other failure
               */
              
              @Transactional
              
              public void registerAdmin(AdminRegistrationRequest req) {
            	    if(userRepo.existsByEmail(req.getEmail())) {
            	    	 throw new EmailAlreadyExistsException(req.getEmail());
            	    }
            	    
            	    try {
            	    	User admin = new User();
            	    	admin.setUsername(req.getUsername());
            	    	admin.setEmail(req.getEmail());
            	    	admin.setName(req.getName());
            	    	admin.setPassword(EncryptionUtil.encrypt(req.getPassword()));
            	    	admin.setStatus("ACTIVE");
            	    	admin.setUserType("ADMIN");
            	    	//admin.setState(req.getState());
            	    	Role adminRole = roleRepo.findByName(ERole.ROLE_ADMIN).orElseThrow(()->
            	    	   new RegistrationException("ROLE_ADMIN not configured",null));
            	    	
            	    	admin.setRoles(Collections.singleton(adminRole));
            	    	// 3. Save admin details in Customer table
            	    	Customer adminCustomer = new Customer();
            	    	adminCustomer.setConsumerId("ADM" + System.currentTimeMillis()%10000000000L); // Use username as admin ID
            	    	adminCustomer.setName(req.getName());
            	    	adminCustomer.setEmail(req.getEmail());
            	    	adminCustomer.setMobile("7880589908"); // Default values for admin
            	    	adminCustomer.setAddress("Admin Office, New Town");
            	    	adminCustomer.setCity("Kolkata");
            	    	adminCustomer.setState("West Bengal");
            	    	adminCustomer.setPincode("700156");
            	    	
            	    	adminCustomer.setUser(admin);
            	    	
            	    	// 4. Save both
            	    	customerRepo.save(adminCustomer);
            	    	
            	    }catch(EmailAlreadyExistsException e) {
            	    	throw e;
            	    }catch(Exception e) {
            	    	throw new RegistrationException("Failed to register administrator",e);
            	    }
             }
}