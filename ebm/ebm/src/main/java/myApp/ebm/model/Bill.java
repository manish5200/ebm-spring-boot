package myApp.ebm.model;

import jakarta.persistence.*;
import lombok.*;
import myApp.ebm.util.IdGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Represents an electricity bill for a customer.
 */
@Entity
@Table(name = "bills")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    /** Internal primary key */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Business key for API/UI.
     * Format: ebm + sequential number (e.g. ebm00000023)
     */
    @Column(name = "bill_id", nullable = false, unique = true, length = 32)
    private String billId;

    /** Customer who owns this bill */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "customer_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_bill_customer"))
    private Customer customer;

    /** Billing period in YYYY-MM format */
    @Column(name = "billing_month", nullable = false, length = 7)
    private String billingMonth;

    /** Amount charged */
    @Column(name = "amount_due", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountDue;

    /** Date the bill was issued */
    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    /** Due date for payment */
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    /**
     * Status of the bill:
     * - PENDING (not paid)
     * - PAID
     */
    @Column(nullable = false, length = 10)
    @Builder.Default
    private String status = "PENDING"; 

    /** When payment was made */
    @Column(name = "payment_date")
    private LocalDate paymentDate;

    /**
     * Business key for the payment transaction.
     * Generated when the bill is paid.
     * Format: ebmp + sequential number (e.g. ebmp000001)
     */
    @Column(name = "payment_id", unique = true, length = 32)
    private String paymentId;

    /**
     * Before first insert, auto‑generate billId and default dates.
     */
    
    
    
    @PrePersist
    public void prePersist() {
        if (this.billId == null) {
             String id;
             do {
            	 id =IdGenerator.generateBillId();
             }while(/* inject a static BillRepository or check via a helper*/false);
             this.billId=id;
        }
        if (this.issueDate == null) {
            this.issueDate = LocalDate.now();
        }
        // Optionally default dueDate if not set:
        if (this.dueDate == null) {
            this.dueDate = this.issueDate.plusDays(15);
        }
    }

    //Setter & Getter
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getBillId() {
		return billId;
	}

	public void setBillId(String billId) {
		this.billId = billId;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public String getBillingMonth() {
		return billingMonth;
	}

	public void setBillingMonth(String billingMonth) {
		this.billingMonth = billingMonth;
	}

	public BigDecimal getAmountDue() {
		return amountDue;
	}

	public void setAmountDue(BigDecimal amountDue) {
		this.amountDue = amountDue;
	}

	public LocalDate getIssueDate() {
		return issueDate;
	}

	public void setIssueDate(LocalDate issueDate) {
		this.issueDate = issueDate;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDate getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDate paymentDate) {
		this.paymentDate = paymentDate;
	}

	public String getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(String paymentId) {
		this.paymentId = paymentId;
	}
    
     
    
}