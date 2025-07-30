package myApp.ebm.config;

import myApp.ebm.model.ERole;
import myApp.ebm.model.Role;
import myApp.ebm.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepo;
    public RoleSeeder(RoleRepository roleRepo) { this.roleRepo = roleRepo; }

    @Override
    @Transactional
    public void run(String... args) {
        for (ERole er : ERole.values()) {
            roleRepo.findByName(er).orElseGet(() -> {
                Role r = new Role();
                r.setName(er);
                return roleRepo.save(r);
            });
        }
    }
}