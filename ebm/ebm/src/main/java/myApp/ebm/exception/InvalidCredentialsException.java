package myApp.ebm.exception;

/**
 * Thrown when a log in attempt fails due to incorrect username or password 
 **/
public class InvalidCredentialsException extends RuntimeException {
                 public InvalidCredentialsException() {
                	  super("Invalid username or password");
                 }
                 
                 public InvalidCredentialsException(String message) {
               	  super(message);
                }
}
