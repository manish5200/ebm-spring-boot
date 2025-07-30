package myApp.ebm.repository;
import myApp.ebm.model.Customer;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface CustomerRepository extends JpaRepository<Customer,Long> {
	        
	         Optional<Customer>findByConsumerId(String consumerId);
	         
	         boolean existsByConsumerId(String consumerId);
	         
	         boolean existsByEmail(String email);
	
}
