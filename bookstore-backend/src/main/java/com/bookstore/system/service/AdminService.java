package com.bookstore.system.service;

import com.bookstore.system.model.Admin;
import com.bookstore.system.model.Login;
import com.bookstore.system.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private PasswordService passwordService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;

    public ResponseEntity<String> newAdmin(Admin newAdmin) {
        if (adminRepository.findByEmail(newAdmin.getEmail()) != null)
            return ResponseEntity.badRequest().body("Account already exists");

        if (!passwordService.isValidPassword(newAdmin.getPassword()))
            return ResponseEntity.badRequest().body("Password invalid");
        newAdmin.setPassword(
                passwordService.encryptPassword(newAdmin.getPassword())
        );

        // save customer in database
        adminRepository.save(newAdmin);
        String jwtToken = jwtService.generateToken(newAdmin);

        // account creation success
        return ResponseEntity.ok().body("Account creation success");
    }

    public ResponseEntity<String> adminLogin(Login login) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        login.getEmail(),
                        login.getPassword()
                )
        );

        Admin admin = adminRepository.findByEmail(login.getEmail());

        if (admin != null) {
            // if here then user is authenticated and exists
            return ResponseEntity.ok().body(jwtService.generateToken(admin));
        }
        return ResponseEntity.badRequest().body("Invalid Credentials");
    }

    public ResponseEntity<String> doesAdminExist(String email) {
        Admin admin = adminRepository.findByEmail(email);

        if (admin != null)
            return ResponseEntity.ok().body("Admin found");
        return ResponseEntity.badRequest().body("Invalid Credentials");
    }
}
