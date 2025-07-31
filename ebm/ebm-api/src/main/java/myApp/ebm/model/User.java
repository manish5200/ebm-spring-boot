package myApp.ebm.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Login credentials and role assignments.
 */
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    /** User's full name */
    @Column(nullable = true, length = 100)
    private String name; 
    
    /** Encrypted via EncryptionUtil */
    @Column(nullable = false)
    private String password;

    /** ACTIVE or INACTIVE */
    @Column(nullable = false, length = 10)
    private String status = "ACTIVE";

    /** CUSTOMER or ADMIN */
    @Column(nullable = false, length = 10)
    private String userType;
    
    //...
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Customer customer;
    //...
    //Getters & Setters
    public Long getId() {
		return id;
	}


	public Customer getCustomer() {
		return customer;
	}


	public void setCustomer(Customer customer) {
		this.customer = customer;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public String getUserType() {
		return userType;
	}


	public void setUserType(String userType) {
		this.userType = userType;
	}


	public Set<Role> getRoles() {
		return roles;
	}


	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}


	/**
     * Roles granted to this user.
     * EAGER so that you can check roles immediately after login.
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name               = "user_roles",
        joinColumns        = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
   
}