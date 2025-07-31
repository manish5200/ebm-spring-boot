package myApp.ebm.controller;

import myApp.ebm.dto.complaint.*; //ComplaintResponse,RegisterComplaintRequest,UpdateComplaintStatusRequest

import myApp.ebm.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//REST endpoints for managing complaints.

@RestController
@RequestMapping("/api/complaints")
@Validated
public class ComplaintController {

    private ComplaintService complaintService;

    @Autowired
    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    /**
     * Register a new complaint.
     */
    @PostMapping
    public ResponseEntity<ComplaintResponse> registerComplaint(
            @RequestBody RegisterComplaintRequest req) {
        ComplaintResponse resp = complaintService.registerComplaint(req);
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }
    
    
    //Get all Complaints
    
    @GetMapping
    public ResponseEntity<List<ComplaintResponse>>getAllComplaints(){
    	      List<ComplaintResponse> resp = complaintService.getAllComplaints();
    	      return new ResponseEntity<>(resp, HttpStatus.OK);

    }
    /**
     * Get all complaints for a customer.
     */
    @GetMapping("/customer/{consumerId}")
    public ResponseEntity<List<ComplaintResponse>> getByCustomer(
            @PathVariable String consumerId) {
        List<ComplaintResponse> list = complaintService.viewCustomerComplaints(consumerId);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    /**
     * Get only OPEN complaints for a customer.
     */
    @GetMapping("/customer/{consumerId}/open")
    public ResponseEntity<List<ComplaintResponse>> getOpenByCustomer(
            @PathVariable String consumerId) {
        List<ComplaintResponse> list = complaintService.viewOpenComplaints(consumerId);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    /**
     * Get a single complaint by its ID.
     */
    @GetMapping("/{complaintId}")
    public ResponseEntity<ComplaintResponse> getById(
            @PathVariable String complaintId) {
        ComplaintResponse resp = complaintService.getComplaintById(complaintId);
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    /**
     * Update the status of an existing complaint.
     */
    @PatchMapping("/{complaintId}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable String complaintId,
            @RequestBody UpdateComplaintStatusRequest req) {
        // enforce pathVariable and body match
        req.setComplaintId(complaintId);
        ComplaintResponse resp = complaintService.updateStatus(req);
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    /**
     * Update complaint status (PUT method for better compatibility)
     */
    @PutMapping("/{complaintId}/status")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(
            @PathVariable String complaintId,
            @RequestBody UpdateComplaintStatusRequest req) {
        // enforce pathVariable and body match
        req.setComplaintId(complaintId);
        ComplaintResponse resp = complaintService.updateStatus(req);
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    /**
     * Edit a complaint (customer, only if status is OPEN)
     */
    @PutMapping("/{complaintId}")
    public ResponseEntity<ComplaintResponse> editComplaint(
            @PathVariable String complaintId,
            @RequestBody RegisterComplaintRequest req) {
        ComplaintResponse resp = complaintService.editComplaint(complaintId, req);
        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    /**
     * Delete a complaint (customer, only if status is OPEN)
     */
    @DeleteMapping("/{complaintId}")
    public ResponseEntity<Void> deleteComplaint(
            @PathVariable String complaintId) {
        complaintService.deleteComplaint(complaintId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}