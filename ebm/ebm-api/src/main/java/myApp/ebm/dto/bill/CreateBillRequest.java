package myApp.ebm.dto.bill;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Payload for creating a new bill for a customer.
 */
public class CreateBillRequest {

    @NotBlank(message = "Consumer ID is required")
    private String consumerId;

    @NotBlank(message = "Billing month is required")
    @Pattern(regexp = "^\\d{4}-\\d{2}$", message = "Billing month must be YYYY-MM")
    private String billingMonth;

    @NotNull(message = "Amount due is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount due must be positive")
    private BigDecimal amountDue;

    /**
     * Bill issue date
     */
    private LocalDate issueDate;

    /**
     * Optional: if omitted, service will default to 15 days after issue date.
     */
    private LocalDate dueDate;

    // Getters & setters
    public String getConsumerId() { return consumerId; }
    public void setConsumerId(String consumerId) { this.consumerId = consumerId; }

    public String getBillingMonth() { return billingMonth; }
    public void setBillingMonth(String billingMonth) { this.billingMonth = billingMonth; }

    public BigDecimal getAmountDue() { return amountDue; }
    public void setAmountDue(BigDecimal amountDue) { this.amountDue = amountDue; }

    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}