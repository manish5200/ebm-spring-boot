package myApp.ebm.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Payload for registering  a new customer 
 **/
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRegistrationRequest {
	@NotBlank(message = "Consumer ID is required")
    @Size(min = 13, max = 13, message = "Consumer ID must be exactly 13 characters")
    private String consumerId;

    @NotBlank(message = "Username is required")
    @Size(min = 5, max = 20, message = "Username must be 5–20 characters")
    private String username;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile is required")
    @Size(min = 10, max = 10, message = "Mobile must be 10 digits")
    private String mobile;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "City is required")
    private String city;
    @NotBlank(message = "State is required")
    private String state;
    @NotBlank(message = "Pincode is required")
    private String pincode;

                 
                 
                 
                 //Setter & Getter
                 
				 public String getConsumerId() {
					 return consumerId;
				 }
				 public void setConsumerId(String consumerId) {
					 this.consumerId = consumerId;
				 }
				 public String getUsername() {
					 return username;
				 }
				 public void setUsername(String username) {
					 this.username = username;
				 }
				 public String getName() {
					 return name;
				 }
				 public void setName(String name) {
					 this.name = name;
				 }
				 public String getEmail() {
					 return email;
				 }
				 public void setEmail(String email) {
					 this.email = email;
				 }
				 public String getMobile() {
					 return mobile;
				 }
				 public void setMobile(String mobile) {
					 this.mobile = mobile;
				 }
				 public String getAddress() {
					 return address;
				 }
				 public void setAddress(String address) {
					 this.address = address;
				 }
				 public String getPassword() {
					 return password;
				 }
				 public void setPassword(String password) {
					 this.password = password;
				 }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
                 
                
                 
}