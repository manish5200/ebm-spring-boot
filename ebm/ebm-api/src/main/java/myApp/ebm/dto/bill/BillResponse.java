package myApp.ebm.dto.bill;


import java.math.BigDecimal;
import java.time.LocalDate;

public class BillResponse {
    private String billId;
    private String billingMonth;
    private BigDecimal amountDue;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private String status;
    private String paymentId;
    private LocalDate paymentDate;
    
    
 // getters & setters
	public String getBillId() {
		return billId;
	}
	public void setBillId(String billId) {
		this.billId = billId;
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
	public String getPaymentId() {
		return paymentId;
	}
	public void setPaymentId(String paymentId) {
		this.paymentId = paymentId;
	}
	public LocalDate getPaymentDate() {
		return paymentDate;
	}
	public void setPaymentDate(LocalDate paymentDate) {
		this.paymentDate = paymentDate;
	}

    
      
}