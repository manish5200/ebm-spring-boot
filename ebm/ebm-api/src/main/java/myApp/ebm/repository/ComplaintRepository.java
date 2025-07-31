package myApp.ebm.repository;

import java.util.*; // Optional , List

import org.springframework.data.jpa.repository.JpaRepository;

import myApp.ebm.model.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint,Long>{
	       
	       Optional<Complaint>findByComplaintId(String complaintId);
	       
	       List<Complaint>findByCustomerConsumerIdAndStatus(String consumerId, String status);

		   //Optional<Complaint> findByCustomerConsumerId(String consumerId);
	       
	       // --- THIS IS THE FIX ---
	       // Change the return type from Optional<Complaint> to List<Complaint>
	       List<Complaint> findByCustomerConsumerId(String consumerId);
}
