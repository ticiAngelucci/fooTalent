package BackEnd.Rentary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RentaryApplication {
	public static void main(String[] args) {
		SpringApplication.run(RentaryApplication.class, args);
	}

}
