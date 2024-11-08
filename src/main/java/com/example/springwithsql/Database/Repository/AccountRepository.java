package com.example.springwithsql.Database.Repository;

import com.example.springwithsql.Database.Entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByUsernameAndPassword(String username, String password);
    Optional<Account> findByUsername(String username);
   // User getUserByUsername(String username);
}
