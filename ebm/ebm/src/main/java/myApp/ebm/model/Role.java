package myApp.ebm.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Persisted roles table for assigning to Users.
 */
@Entity
@Table(name = "roles")
@Getter
@Setter

@Builder
public class Role {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 20)
    private ERole name;

    public Role() {}
	public Role(Long id, ERole name) {
		super();
		this.id = id;
		this.name = name;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public ERole getName() {
		return name;
	}
	public void setName(ERole name) {
		this.name = name;
	}
	
	
	
    
    
}