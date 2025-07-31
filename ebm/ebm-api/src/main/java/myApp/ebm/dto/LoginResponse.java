package myApp.ebm.dto;


/**
 * Response returned after successful login 
 **/
public class LoginResponse {
               
	    private String message; // e.g. "Login successful"
	    private String userType; // e.g. "CUSTOMER" or "ADMIN"
	    private String username;
	    private Long userId;
	    private String name;
	    private String consumerId; // For customer users
	    
	    
	    public LoginResponse() {}
	    
		
		public LoginResponse(String message, String userType, String username, Long userId, String name,
				String consumerId) {
			super();
			this.message = message;
			this.userType = userType;
			this.username = username;
			this.userId = userId;
			this.name = name;
			this.consumerId = consumerId;
		}

		
		//Getters and Setters 

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

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
		
		public String getConsumerId() {
			return consumerId;
		}

		public void setConsumerId(String consumerId) {
			this.consumerId = consumerId;
		}
	      
		  
	      
}