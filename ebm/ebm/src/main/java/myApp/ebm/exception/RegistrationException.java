package myApp.ebm.exception;
/**
 * Generic exception wrapping failures during registration flows.
 **/
public class RegistrationException extends RuntimeException {
             public RegistrationException(String message , Throwable cause) {
            	  super(message,cause);
             }
}
