package myApp.ebm.repository;

import myApp.ebm.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findByBillId(String billId);

    /** All bills for a given customer */
    List<Bill> findByCustomerConsumerId(String consumerId);

    /** Pending and Paid bills for a customer */
    List<Bill> findByCustomerConsumerIdAndStatus(String consumerId, String status);

	boolean existsByBillId(String billId);

	boolean existsByPaymentId(String paymentId);
}