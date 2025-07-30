package myApp.ebm.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

public class IdGenerator {

    private static final AtomicInteger BILL_SEQ = new AtomicInteger(100);  // short range
    private static final AtomicInteger PAY_SEQ = new AtomicInteger(500);   // short range
    private static final AtomicInteger COMP_SEQ = new AtomicInteger(500);   // short range

    private static String getTimeSuffix() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));
    }

    // Example: ebm144532102 (HHmmss + short counter)
    public static String generateBillId() {
        return "ebm" + getTimeSuffix() + BILL_SEQ.getAndIncrement();
    }

    // Example: ebmp144533503 (HHmmss + short counter)
    public static String generatePaymentId() {
        return "ebmp" + getTimeSuffix() + PAY_SEQ.getAndIncrement();
    }

	public static String generateComplaintId() {
		  
		return "ebmc" + getTimeSuffix() + COMP_SEQ.getAndIncrement();
	}
}