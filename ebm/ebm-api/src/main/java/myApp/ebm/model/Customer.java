package myApp.ebm.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Customer profile linked one‑to‑one with a User account.
 */
@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 13‑digit business key (frontend‑validated) */
    @Column(nullable = false, unique = true, length = 13)
    private String consumerId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 10)
    private String mobile;

    @Column(nullable = true, length = 50)
    private String city;

    @Column(nullable = true, length = 50)
    private String state;

    @Column(nullable = true, length = 10)
    private String pincode;

    //Setters and Getters
    
    public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public String getConsumerId() {
		return consumerId;
	}



	public void setConsumerId(String consumerId) {
		this.consumerId = consumerId;
	}



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}



	public String getAddress() {
		return address;
	}



	public void setAddress(String address) {
		this.address = address;
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

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }


    /** One‑to‑one link to login credentials */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, 
                foreignKey = @ForeignKey(name = "fk_customer_user"))
    private User user;
    
    public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

    
}