package BackEnd.Rentary.Auth.Util;

import BackEnd.Rentary.Users.Entities.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @OneToOne
    private User user;

    private LocalDateTime expiryDate;
}
