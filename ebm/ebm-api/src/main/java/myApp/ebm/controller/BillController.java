package myApp.ebm.controller;

import jakarta.validation.Valid;
import myApp.ebm.dto.bill.*;
import myApp.ebm.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

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
     * View all bills (admin only).
     */
    @GetMapping
    public ResponseEntity<List<BillResponse>> getAllBills() {
        List<BillResponse> bills = billService.getAllBills();
        return ResponseEntity.ok(bills);
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
     * Delete a bill (admin only)
     */
    @DeleteMapping("/{billId}")
    public ResponseEntity<Void> deleteBill(@PathVariable String billId) {
        billService.deleteBillByBillId(billId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Get bill by ID
     */
    @GetMapping("/{billId}")
    public ResponseEntity<BillResponse> getBillById(@PathVariable String billId) {
        BillResponse bill = billService.getBillById(billId);
        return ResponseEntity.ok(bill);
    }

    /**
     * Update a bill (admin only)
     */
    @PutMapping("/{billId}")
    public ResponseEntity<BillResponse> updateBill(
            @PathVariable String billId,
            @Valid @RequestBody CreateBillRequest req) {
        BillResponse resp = billService.updateBill(billId, req);
        return ResponseEntity.ok(resp);
    }

    /**
     * Get bills by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BillResponse>> getBillsByStatus(@PathVariable String status) {
        List<BillResponse> bills = billService.getBillsByStatus(status);
        return ResponseEntity.ok(bills);
    }

    /**
     * Get bill statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getBillStats() {
        Map<String, Object> stats = billService.getBillStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get payment history for all customers (admin)
     */
    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> getAllPaymentHistory() {
        List<PaymentResponse> payments = billService.getAllPaymentHistory();
        return ResponseEntity.ok(payments);
    }

    /**
     * Get payment history for a specific customer
     */
    @GetMapping("/payments/customer/{consumerId}")
    public ResponseEntity<List<PaymentResponse>> getCustomerPaymentHistory(@PathVariable String consumerId) {
        List<PaymentResponse> payments = billService.getCustomerPaymentHistory(consumerId);
        return ResponseEntity.ok(payments);
    }
}