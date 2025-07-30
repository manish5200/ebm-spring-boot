package myApp.ebm.exception;

public class CustomerNotFoundException extends RuntimeException {
	    public  CustomerNotFoundException(String consumerId) {
	    	  super("Customer not found with consumerId: "+consumerId);
	    }
}
