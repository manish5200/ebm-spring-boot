package myApp.ebm.exception;

/**
 * Thrown when attempting to register with an email that already exists 
 **/
public class EmailAlreadyExistsException extends RuntimeException {
	     public EmailAlreadyExistsException(String email) {
	    	  super("Email already in use: "+email );
	     }
}
