package myApp.ebm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(
    info = @Info(
        title = "Electricity Bill Management API",
        version = "1.0",
        description = "API documentation for managing bills, complaints, and customers"
    )
) 
@SpringBootApplication
public class ElectricityBillManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ElectricityBillManagementSystemApplication.class, args);
	}

}
