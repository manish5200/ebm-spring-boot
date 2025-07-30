package myApp.ebm.controller;

import jakarta.validation.Valid;
import myApp.ebm.dto.bill.*;
import myApp.ebm.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Bill Controller", description = "APIs for bill operations")
@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired private BillService billService;
    
    @PostMapping
    public ResponseEntity<BillResponse>createBill(@Valid @RequestBody CreateBillRequest req){
    	      BillResponse resp = billService.createBill(req);
    	      return ResponseEntity
    	    		  .status(HttpStatus.CREATED).body(resp);
    }
    

    /**
     * View all bills for a customer.
     */
    @GetMapping("/customer/{consumerId}")
    public ResponseEntity<List<BillResponse>> getAllBills(
            @PathVariable String consumerId) {

        List<BillResponse> bills = billService.viewAllBills(consumerId);
        return ResponseEntity.ok(bills);
    }

    /**
     * View pending bills for a customer.
     */
    @GetMapping("/customer/{consumerId}/pending")
    public ResponseEntity<List<BillResponse>> getPendingBills(
            @PathVariable String consumerId) {

        List<BillResponse> bills = billService.viewPendingBills(consumerId);
        return ResponseEntity.ok(bills);
    }
    
    /**
     * View paid bills (history) for a customer.
     */
    @GetMapping("/customer/{consumerId}/paid")
    public ResponseEntity<List<BillResponse>> getPaidBills(
            @PathVariable String consumerId) {
        List<BillResponse> bills = billService.viewPaidBills(consumerId);
        return ResponseEntity.ok(bills);
    }

    

    /**
     * Pay a bill.
     */
    @PostMapping("/pay")
    public ResponseEntity<PaymentResponse> payBill(
            @Valid @RequestBody PaymentRequest req) {

        PaymentResponse resp = billService.payBill(req);
        return ResponseEntity.ok(resp);
    }
    
    /**
     * Pay a bill by billId (simplified for customer dashboard)
     */
    @PostMapping("/{billId}/pay")
    public ResponseEntity<PaymentResponse> payBillById(@PathVariable String billId) {
        PaymentRequest req = new PaymentRequest();
        req.setBillId(billId);
        // Set a default amount that covers the full bill
        req.setAmountPaid(new java.math.BigDecimal("999999"));
        
        PaymentResponse resp = billService.payBill(req);
        return ResponseEntity.ok(resp);
    }
    /**
     * Delete a bill (admin only)
     */
    @DeleteMapping("/{billId}")
    public ResponseEntity<Void> deleteBill(@PathVariable String billId) {
        billService.deleteBillByBillId(billId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}