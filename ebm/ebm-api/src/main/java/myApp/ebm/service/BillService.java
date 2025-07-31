
package myApp.ebm.service;

import myApp.ebm.dto.bill.*;
import myApp.ebm.exception.*;
import myApp.ebm.model.*;
import myApp.ebm.repository.*;
import myApp.ebm.util.IdGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepo;

    @Autowired
    private CustomerRepository customerRepo;

    /**
     * Create a new bill for a customer.
     */
    @Transactional
    public BillResponse createBill(CreateBillRequest req) {
        Customer customer = customerRepo.findByConsumerId(req.getConsumerId())
                .orElseThrow(() -> new CustomerNotFoundException(req.getConsumerId()));
        //Generate a unique billId
        String billId;
        do {
        	billId=IdGenerator.generateBillId();
        }while(billRepo.existsByBillId(billId));
        
        Bill bill = new Bill();
        bill.setBillId(billId);
        bill.setCustomer(customer);
        bill.setBillingMonth(req.getBillingMonth());
        bill.setAmountDue(req.getAmountDue());
        // dueDate defaulted to 15 days after issueDate in @PrePersist
        if (req.getDueDate() != null) {
            bill.setDueDate(req.getDueDate());
        }

        Bill saved = billRepo.save(bill);
        return toDto(saved);
    }

    /**
     * View all bills (admin only).
     */
    public List<BillResponse> getAllBills() {
        List<Bill> bills = billRepo.findAll();
        return bills.stream()
                .sorted(Comparator.comparing(Bill::getIssueDate).reversed())
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * View all bills (paid + pending) – the customer's full history,
     * sorted by issueDate descending.
     */
    public List<BillResponse> viewAllBills(String consumerId) {
        List<Bill> bills = billRepo.findByCustomerConsumerId(consumerId);
        return bills.stream()
                .sorted(Comparator.comparing(Bill::getIssueDate).reversed())
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * View only pending bills for a customer.
     */
    public List<BillResponse> viewPendingBills(String consumerId) {
        List<Bill> bills = billRepo.findByCustomerConsumerIdAndStatus(consumerId, "PENDING");
        return bills.stream()
                .sorted(Comparator.comparing(Bill::getIssueDate).reversed())
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * View only paid bills for a customer (bill history).
     */
    public List<BillResponse> viewPaidBills(String consumerId) {
        List<Bill> bills = billRepo.findByCustomerConsumerIdAndStatus(consumerId, "PAID");
        return bills.stream()
                .sorted(Comparator.comparing(Bill::getPaymentDate).reversed())
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Pay (or partially pay) a bill by its billId.
     */
    @Transactional
    public PaymentResponse payBill(PaymentRequest req) {
        Bill bill = billRepo.findByBillId(req.getBillId())
                .orElseThrow(() -> new BillNotFoundException(req.getBillId()));

        if ("PAID".equalsIgnoreCase(bill.getStatus())) {
            throw new PaymentException("Bill already paid", null);
        }
        try {
        BigDecimal paid = req.getAmountPaid();
        BigDecimal remaining = bill.getAmountDue().subtract(paid);
        bill.setAmountDue(remaining.max(BigDecimal.ZERO));
        //Always record when a payment happens
        LocalDate now = LocalDate.now();
        bill.setPaymentDate(now);
        
        //only generate payment id if not already set
        if(bill.getPaymentId()==null) {
        	 String paymentId; 
        	 do {
        		 paymentId = IdGenerator.generatePaymentId();
        	 }while(billRepo.existsByPaymentId(paymentId));
        	 
        	 bill.setPaymentId(paymentId);
        }
        

        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
            bill.setStatus("PAID");
     
        } else {
            bill.setStatus("PENDING");
        }

        billRepo.save(bill);

        String message = remaining.compareTo(BigDecimal.ZERO) <= 0
                ? "Bill fully paid"
                : "Partial payment received, remaining due: " + bill.getAmountDue();

        return new PaymentResponse(message, bill.getPaymentId(), bill.getStatus());
        }catch(Exception e) {
        	 throw new PaymentException("Failed to process payment",e);
        }
    }

    /**
     * Delete a bill by billId (admin only)
     */
    @Transactional
    public void deleteBillByBillId(String billId) {
        Bill bill = billRepo.findByBillId(billId)
            .orElseThrow(() -> new BillNotFoundException(billId));
        billRepo.delete(bill);
    }

    /**
     * Get bill by ID
     */
    public BillResponse getBillById(String billId) {
        Bill bill = billRepo.findByBillId(billId)
            .orElseThrow(() -> new BillNotFoundException(billId));
        return toDto(bill);
    }

    /**
     * Update a bill (admin only)
     */
    @Transactional
    public BillResponse updateBill(String billId, CreateBillRequest req) {
        Bill bill = billRepo.findByBillId(billId)
            .orElseThrow(() -> new BillNotFoundException(billId));
        
        Customer customer = customerRepo.findByConsumerId(req.getConsumerId())
            .orElseThrow(() -> new CustomerNotFoundException(req.getConsumerId()));
        
        bill.setCustomer(customer);
        bill.setBillingMonth(req.getBillingMonth());
        bill.setAmountDue(req.getAmountDue());
        bill.setIssueDate(req.getIssueDate());
        bill.setDueDate(req.getDueDate());
        
        Bill updated = billRepo.save(bill);
        return toDto(updated);
    }

    /**
     * Get bills by status
     */
    public List<BillResponse> getBillsByStatus(String status) {
        List<Bill> bills = billRepo.findByStatus(status);
        return bills.stream()
                .sorted(Comparator.comparing(Bill::getIssueDate).reversed())
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get bill statistics
     */
    public Map<String, Object> getBillStats() {
        long totalBills = billRepo.count();
        long pendingBills = billRepo.countByStatus("PENDING");
        long paidBills = billRepo.countByStatus("PAID");
        long overdueBills = billRepo.countByStatus("OVERDUE");
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBills", totalBills);
        stats.put("pendingBills", pendingBills);
        stats.put("paidBills", paidBills);
        stats.put("overdueBills", overdueBills);
        stats.put("totalRevenue", billRepo.sumAmountDueByStatus("PAID"));
        
        return stats;
    }

    /**
     * Get all payment history (admin)
     */
    public List<PaymentResponse> getAllPaymentHistory() {
        List<Bill> paidBills = billRepo.findByStatus("PAID");
        return paidBills.stream()
                .sorted(Comparator.comparing(Bill::getPaymentDate).reversed())
                .map(bill -> new PaymentResponse(
                    "Payment completed",
                    bill.getPaymentId(),
                    bill.getStatus()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Get payment history for a specific customer
     */
    public List<PaymentResponse> getCustomerPaymentHistory(String consumerId) {
        List<Bill> paidBills = billRepo.findByCustomerConsumerIdAndStatus(consumerId, "PAID");
        return paidBills.stream()
                .sorted(Comparator.comparing(Bill::getPaymentDate).reversed())
                .map(bill -> new PaymentResponse(
                    "Payment completed",
                    bill.getPaymentId(),
                    bill.getStatus()
                ))
                .collect(Collectors.toList());
    }

    /** Helper to map entity → DTO */
    private BillResponse toDto(Bill b) {
        BillResponse dto = new BillResponse();
        dto.setBillId(b.getBillId());
        dto.setBillingMonth(b.getBillingMonth());
        dto.setAmountDue(b.getAmountDue());
        dto.setIssueDate(b.getIssueDate());
        dto.setDueDate(b.getDueDate());
        dto.setStatus(b.getStatus());
        dto.setPaymentId(b.getPaymentId());
        dto.setPaymentDate(b.getPaymentDate());
        return dto;
    }
}
