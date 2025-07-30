package myApp.ebm.dto.bill;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PaymentRequest {
	       
	       @NotBlank(message ="Bill ID is reuired")
	       private String billId;

	       
	       @NotNull(message="Payment amount is required")
	       private  BigDecimal amountPaid;
	       
	       
		   public String getBillId() {
			   return billId;
		   }

		   public void setBillId(String billId) {
			   this.billId = billId;
		   }

		   public BigDecimal getAmountPaid() {
			   return amountPaid;
		   }

		   public void setAmountPaid(BigDecimal amountPaid) {
			   this.amountPaid = amountPaid;
		   }
	       
	       
	       
	       
}
