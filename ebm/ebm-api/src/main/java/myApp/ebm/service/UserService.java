package myApp.ebm.service;

import myApp.ebm.model.User;
import myApp.ebm.repository.UserRepository;
import myApp.ebm.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    /**
     * Get user by ID
     */
    public User getUserById(Long userId) {
        return userRepo.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
    }

    /**
     * Update user
     */
    @Transactional
    public User updateUser(Long userId, User userData) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
        
        // Update only allowed fields
        if (userData.getName() != null) {
            user.setName(userData.getName());
        }
        if (userData.getEmail() != null) {
            user.setEmail(userData.getEmail());
        }

        if (userData.getStatus() != null) {
            user.setStatus(userData.getStatus());
        }
        return userRepo.save(user);
    }

    /**
     * Delete user
     */
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
        userRepo.delete(user);
    }
}