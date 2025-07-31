package myApp.ebm.repository;

import myApp.ebm.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findByBillId(String billId);

    /** All bills for a given customer */
    List<Bill> findByCustomerConsumerId(String consumerId);

    /** Pending and Paid bills for a customer */
    List<Bill> findByCustomerConsumerIdAndStatus(String consumerId, String status);

    /** Bills by status */
    List<Bill> findByStatus(String status);

    /** Count bills by status */
    long countByStatus(String status);

    /** Sum amount due for bills with specific status */
    @Query("SELECT COALESCE(SUM(b.amountDue), 0) FROM Bill b WHERE b.status = :status")
    BigDecimal sumAmountDueByStatus(@Param("status") String status);

	boolean existsByBillId(String billId);

	boolean existsByPaymentId(String paymentId);
}