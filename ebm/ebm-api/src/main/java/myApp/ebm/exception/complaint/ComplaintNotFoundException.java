package myApp.ebm.exception.complaint;

public class ComplaintNotFoundException extends RuntimeException {
	    public ComplaintNotFoundException(String complaintId) {
	    	 super("No complaint is there for Complaint ID: "+complaintId);
	    }
}
