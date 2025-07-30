package myApp.ebm.dto.complaint;

import jakarta.validation.constraints.NotBlank;

public class UpdateComplaintStatusRequest {
	
	    @NotBlank(message = "Complaint ID is required")
         private String complaintId;
	    
	    @NotBlank(message = "Status is required")
	     private String status;

    // Optional admin response message
    private String adminResponse;

	    
	    //Getter & Setter
		public String getComplaintId() {
			return complaintId;
		}

		public void setComplaintId(String complaintId) {
			this.complaintId = complaintId;
		}

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

    public String getAdminResponse() {
        return adminResponse;
    }
    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }
    
	       
}