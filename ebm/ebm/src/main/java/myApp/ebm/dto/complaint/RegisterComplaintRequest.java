package myApp.ebm.dto.complaint;

import jakarta.validation.constraints.NotBlank;


//Payload for registering a new complaint by customer
public class RegisterComplaintRequest {
	
	     @NotBlank(message = "Consumer ID is required")
	     private String consumerId;
	     
	     @NotBlank(message = "Complaint type is required")
	     private String type;
	     
	     @NotBlank(message = "Category is required")
	     private String category;
	     
	     @NotBlank(message = "Problem Description is required")
	     private String problem;
	     
	     
	     private String landmark;


	     
	     //Getter && Setter
		 public String getConsumerId() {
			 return consumerId;
		 }


		 public void setConsumerId(String consumerId) {
			 this.consumerId = consumerId;
		 }


		 public String getType() {
			 return type;
		 }


		 public void setType(String type) {
			 this.type = type;
		 }


		 public String getCategory() {
			 return category;
		 }


		 public void setCategory(String category) {
			 this.category = category;
		 }


		 public String getProblem() {
			 return problem;
		 }


		 public void setProblem(String problem) {
			 this.problem = problem;
		 }


		 public String getLandmark() {
			 return landmark;
		 }


		 public void setLandmark(String landmark) {
			 this.landmark = landmark;
		 }
	     
	     
}
