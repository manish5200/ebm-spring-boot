package myApp.ebm.dto.bill;

public class PaymentResponse {
	  private String message;
	  private String paymentId;
	  private String status;
	  public PaymentResponse(String message, String paymentId, String status) {
		super();
		this.message = message;
		this.paymentId = paymentId;
		this.status = status;
	  }
	  
	  //Setter & Getter
	  public String getMessage() {
		  return message;
	  }
	  public void setMessage(String message) {
		  this.message = message;
	  }
	  public String getPaymentId() {
		  return paymentId;
	  }
	  public void setPaymentId(String paymentId) {
		  this.paymentId = paymentId;
	  }
	  public String getStatus() {
		  return status;
	  }
	  public void setStatus(String status) {
		  this.status = status;
	  }
	  
	   
}
