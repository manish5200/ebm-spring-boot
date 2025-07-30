package myApp.ebm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import myApp.ebm.model.ERole;
import myApp.ebm.model.Role;

public interface RoleRepository extends JpaRepository<Role,Long> {
	
	      Optional<Role>findByName(ERole name);
}
