package myApp.ebm.service;

import myApp.ebm.dto.LoginRequest;
import myApp.ebm.dto.LoginResponse;
import myApp.ebm.exception.AccountInactiveException;
import myApp.ebm.exception.InvalidCredentialsException;
import myApp.ebm.model.User;
import myApp.ebm.repository.UserRepository;
import myApp.ebm.util.EncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for validating user login credentials.
 */
@Service
public class LoginService {

    @Autowired private UserRepository userRepo;

    /**
     * Validates a login attempt.
     *
     * @param req contains username and plain‑text password
     * @return LoginResponse on success
     * @throws InvalidCredentialsException if username not found or password mismatch
     * @throws AccountInactiveException    if user.status != "ACTIVE"
     */
    public LoginResponse validateLogin(LoginRequest req) {
        User user = userRepo.findByUsername(req.getUsername())
                .orElseThrow(InvalidCredentialsException::new);

        // manual decryption & comparison
        String plain = EncryptionUtil.decrypt(user.getPassword());
        if (!plain.equals(req.getPassword())) {
            throw new InvalidCredentialsException();
        }

        // status check
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new AccountInactiveException();
        }

        return new LoginResponse(
            "Login successful",
            user.getUsername(),
            user.getUserType(),
            user.getId()
        );
    }
}