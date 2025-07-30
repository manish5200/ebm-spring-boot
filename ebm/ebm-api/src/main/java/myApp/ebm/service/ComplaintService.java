package myApp.ebm.service;

import myApp.ebm.dto.complaint.*; //ComplaintResponse,RegisterComplaintRequest,UpdateComplaintStatusRequest
import myApp.ebm.exception.CustomerNotFoundException;
import myApp.ebm.exception.complaint.*; //ComplaintException,ComplaintNotFoundException,CustomerNotFoundException

import myApp.ebm.model.Complaint;
import myApp.ebm.model.Customer;
import myApp.ebm.repository.ComplaintRepository;
import myApp.ebm.repository.CustomerRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for handling complaint operations.
 */
@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepo;

    @Autowired
    private CustomerRepository customerRepo;

    /**
     * Registers a new complaint for a customer.
     */
    @Transactional
    public ComplaintResponse registerComplaint(RegisterComplaintRequest req) {
        Customer cust = customerRepo.findByConsumerId(req.getConsumerId())
            .orElseThrow(() -> new CustomerNotFoundException(req.getConsumerId()));

        try {
            Complaint c = new Complaint();
            c.setCustomer(cust);
            c.setType(req.getType());
            c.setCategory(req.getCategory());
            c.setProblem(req.getProblem());
            c.setLandmark(req.getLandmark());
            // status, createdAt, complaintId are set by @PrePersist

            Complaint saved = complaintRepo.save(c);
            return toDto(saved);
        } catch (Exception e) {
            throw new ComplaintException("Failed to register complaint", e);
        }
    }

    /**
     * Returns all complaints for a given customer.
     */
    public List<ComplaintResponse> viewCustomerComplaints(String consumerId) {
        customerRepo.findByConsumerId(consumerId)
            .orElseThrow(() -> new CustomerNotFoundException(consumerId));

        return complaintRepo.findByCustomerConsumerId(consumerId)
               .stream()
               .map(this::toDto)
               .collect(Collectors.toList());
    }

    /**
     * Returns only OPEN complaints for a given customer.
     */
    public List<ComplaintResponse> viewOpenComplaints(String consumerId) {
        customerRepo.findByConsumerId(consumerId)
            .orElseThrow(() -> new CustomerNotFoundException(consumerId));

        return complaintRepo.findByCustomerConsumerIdAndStatus(consumerId, "OPEN")
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Retrieves a complaint by its business key.
     */
    public ComplaintResponse getComplaintById(String complaintId) {
        Complaint c = complaintRepo.findByComplaintId(complaintId)
            .orElseThrow(() -> new ComplaintNotFoundException(complaintId));
        return toDto(c);
    }

    /**
     * Updates the status of an existing complaint.
     */
    @Transactional
    public ComplaintResponse updateStatus(UpdateComplaintStatusRequest req) {
        Complaint c = complaintRepo.findByComplaintId(req.getComplaintId())
            .orElseThrow(() -> new ComplaintNotFoundException(req.getComplaintId()));

        c.setStatus(req.getStatus());
        if (req.getAdminResponse() != null) {
            c.setAdminResponse(req.getAdminResponse());
        }
        Complaint updated = complaintRepo.save(c);
        return toDto(updated);
    }

    /**
     * Edit a complaint (customer, only if status is OPEN)
     */
    @Transactional
    public ComplaintResponse editComplaint(String complaintId, RegisterComplaintRequest req) {
        Complaint c = complaintRepo.findByComplaintId(complaintId)
            .orElseThrow(() -> new ComplaintNotFoundException(complaintId));
        if (!"OPEN".equalsIgnoreCase(c.getStatus())) {
            throw new ComplaintException("Only OPEN complaints can be edited");
        }
        c.setType(req.getType());
        c.setCategory(req.getCategory());
        c.setProblem(req.getProblem());
        c.setLandmark(req.getLandmark());
        Complaint updated = complaintRepo.save(c);
        return toDto(updated);
    }

    /**
     * Delete a complaint (customer, only if status is OPEN)
     */
    @Transactional
    public void deleteComplaint(String complaintId) {
        Complaint c = complaintRepo.findByComplaintId(complaintId)
            .orElseThrow(() -> new ComplaintNotFoundException(complaintId));
        if (!"OPEN".equalsIgnoreCase(c.getStatus())) {
            throw new ComplaintException("Only OPEN complaints can be deleted");
        }
        complaintRepo.delete(c);
    }

    /**
     * Helper: convert entity to DTO
     */
    private ComplaintResponse toDto(Complaint c) {
        ComplaintResponse r = new ComplaintResponse();
        r.setComplaintId(c.getComplaintId());
        r.setConsumerId(c.getCustomer().getConsumerId());
        r.setCustomerName(c.getCustomer().getName());
        r.setType(c.getType());
        r.setCategory(c.getCategory());
        r.setProblem(c.getProblem());
        r.setLandmark(c.getLandmark());
        r.setStatus(c.getStatus());
        r.setCreatedAt(c.getCreatedAt());
        r.setUpdatedAt(c.getUpdatedAt());
        r.setAdminResponse(c.getAdminResponse());
        return r;
    }
    
	public List<ComplaintResponse> getAllComplaints() {
		List<ComplaintResponse>list= complaintRepo.findAll()
				                    .stream().map(this::toDto).collect(Collectors.toList());
		return list;
	}
}