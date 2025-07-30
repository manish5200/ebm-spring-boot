package myApp.ebm.dto;


/**
 * Response returned after successful login 
 **/
public class LoginResponse {
               
	    private String message; // e.g. "Login successful"
	    private String userType; // e.g. "CUSTOMER" or "LOGIN"
	    private String username;
	    private Long userId;
	    
	    
	    public LoginResponse() {}
	    
		public LoginResponse(String message,String username, String userType, Long userId) {
			super();
			this.message = message;
			this.userType = userType;
			this.userId = userId;
			this.username=username;
		}
		
		
		//Getters and Setters 

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}

		public String getUserType() {
			return userType;
		}

		public void setUserType(String userType) {
			this.userType = userType;
		}

		public Long getUserId() {
			return userId;
		}

		public void setUserId(Long userId) {
			this.userId = userId;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}
	    
	      
		  
	      
}
