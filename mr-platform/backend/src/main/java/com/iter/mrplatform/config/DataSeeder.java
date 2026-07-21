package com.iter.mrplatform.config;

import com.iter.mrplatform.entity.*;
import com.iter.mrplatform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Seeds demo data so the app is usable immediately after startup.
 * Default password for every seeded user is: password123
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TerritoryRepository territoryRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // already seeded
        }

        Territory north = new Territory();
        north.setName("North Zone - Delhi NCR");
        north.setRegion("North");
        territoryRepository.save(north);

        Territory east = new Territory();
        east.setName("East Zone - Bhubaneswar");
        east.setRegion("East");
        territoryRepository.save(east);

        User admin = new User();
        admin.setName("System Admin");
        admin.setEmail("admin@iter-pharma.com");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        User manager = new User();
        manager.setName("Priya Sharma");
        manager.setEmail("manager@iter-pharma.com");
        manager.setPassword(passwordEncoder.encode("password123"));
        manager.setRole(Role.MANAGER);
        userRepository.save(manager);
        north.setManager(manager);
        east.setManager(manager);
        territoryRepository.save(north);
        territoryRepository.save(east);

        User mr1 = new User();
        mr1.setName("Arjun Khan");
        mr1.setEmail("mr1@iter-pharma.com");
        mr1.setPassword(passwordEncoder.encode("password123"));
        mr1.setRole(Role.MR);
        mr1.setTerritory(east);
        userRepository.save(mr1);

        User mr2 = new User();
        mr2.setName("Rina Das");
        mr2.setEmail("mr2@iter-pharma.com");
        mr2.setPassword(passwordEncoder.encode("password123"));
        mr2.setRole(Role.MR);
        mr2.setTerritory(north);
        userRepository.save(mr2);

        Doctor d1 = new Doctor();
        d1.setName("Dr. Anil Mehta");
        d1.setSpecialization("Cardiology");
        d1.setHospitalOrPharmacy("Apollo Hospital, Bhubaneswar");
        d1.setPhone("9876543210");
        d1.setAddress("Sainik School Road, Bhubaneswar");
        d1.setLatitude(20.2961);
        d1.setLongitude(85.8245);
        d1.setTerritory(east);
        d1.setConsentOnFile(true);
        doctorRepository.save(d1);

        Doctor d2 = new Doctor();
        d2.setName("Dr. Sunita Rao");
        d2.setSpecialization("General Medicine");
        d2.setHospitalOrPharmacy("City Care Clinic, Delhi");
        d2.setPhone("9123456780");
        d2.setAddress("Connaught Place, New Delhi");
        d2.setLatitude(28.6315);
        d2.setLongitude(77.2167);
        d2.setTerritory(north);
        d2.setConsentOnFile(true);
        doctorRepository.save(d2);

        Product p1 = new Product();
        p1.setSku("CARD-500");
        p1.setName("Cardiozen 500mg");
        p1.setPrice(new BigDecimal("120.00"));
        p1.setTaxPercent(new BigDecimal("12.00"));
        p1.setStockOnHand(500);
        p1.setReorderThreshold(100);
        productRepository.save(p1);

        Product p2 = new Product();
        p2.setSku("PARA-650");
        p2.setName("Paravex 650mg");
        p2.setPrice(new BigDecimal("35.00"));
        p2.setTaxPercent(new BigDecimal("5.00"));
        p2.setStockOnHand(1000);
        p2.setReorderThreshold(200);
        productRepository.save(p2);

        Product p3 = new Product();
        p3.setSku("IMMU-100");
        p3.setName("ImmunoBoost 100mg");
        p3.setPrice(new BigDecimal("210.00"));
        p3.setTaxPercent(new BigDecimal("12.00"));
        p3.setStockOnHand(60);
        p3.setReorderThreshold(75); // intentionally below threshold -> triggers alert
        productRepository.save(p3);

        System.out.println("=== Demo data seeded. Login with admin@iter-pharma.com / password123 (or manager@ / mr1@ / mr2@) ===");
    }
}
