package myApp.ebm.exception;


/**
 * Thrown when a user with status != ACTIVE attempts to log in
 **/
public class AccountInactiveException extends RuntimeException {
	
	            public AccountInactiveException() {
	            	super("Account is inactive. Please contact support.");
	            }
	            
	            public AccountInactiveException(String message) {
	            	super(message);
	            }
}
