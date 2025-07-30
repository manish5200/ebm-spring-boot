package myApp.ebm.model;

import jakarta.persistence.*;
import myApp.ebm.util.IdGenerator;

import java.time.LocalDateTime;

/**
 * Represents a customer service complaint.
 */
@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Business key: ebmc + some digit sequence
    @Column(name = "complaint_id", length = 16, nullable = false, unique = true)
    private String complaintId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id",
                nullable = false,
                foreignKey = @ForeignKey(name = "fk_complaint_customer"))
    private Customer customer;

    //New: complaint type (SERVICE, TECHNICAL, BILLING, etc.) 
    @Column(length = 30, nullable = false)
    private String type;

    // Category of the complaint (e.g. "Meter Issue")
    @Column(length = 50, nullable = false)
    private String category;

    //Detailed description 
    @Column(length = 500, nullable = false)
    private String problem;

    //Optional landmark
    @Column(length = 100)
    private String landmark;

    // OPEN, IN_PROGRESS, RESOLVED, CLOSED 
    @Column(length = 20, nullable = false)
    private String status = "OPEN";
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Admin response message
    @Column(length = 500)
    private String adminResponse;

    @PrePersist
    protected void onCreate() {
        this.complaintId = IdGenerator.generateComplaintId();
        this.createdAt   = LocalDateTime.now();
        this.updatedAt   = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Default constructor
    public Complaint() {
    }

    // All-args constructor
    public Complaint(Long id, String complaintId, Customer customer, String type, String category, String problem, String landmark, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.complaintId = complaintId;
        this.customer = customer;
        this.type = type;
        this.category = category;
        this.problem = problem;
        this.landmark = landmark;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Builder pattern
    public static ComplaintBuilder builder() {
        return new ComplaintBuilder();
    }

    public static class ComplaintBuilder {
        private Long id;
        private String complaintId;
        private Customer customer;
        private String type;
        private String category;
        private String problem;
        private String landmark;
        private String status = "OPEN";
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ComplaintBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ComplaintBuilder complaintId(String complaintId) {
            this.complaintId = complaintId;
            return this;
        }

        public ComplaintBuilder customer(Customer customer) {
            this.customer = customer;
            return this;
        }

        public ComplaintBuilder type(String type) {
            this.type = type;
            return this;
        }

        public ComplaintBuilder category(String category) {
            this.category = category;
            return this;
        }

        public ComplaintBuilder problem(String problem) {
            this.problem = problem;
            return this;
        }

        public ComplaintBuilder landmark(String landmark) {
            this.landmark = landmark;
            return this;
        }

        public ComplaintBuilder status(String status) {
            this.status = status;
            return this;
        }

        public ComplaintBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ComplaintBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Complaint build() {
            return new Complaint(id, complaintId, customer, type, category, problem, landmark, status, createdAt, updatedAt);
        }
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getComplaintId() {
        return complaintId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public String getType() {
        return type;
    }

    public String getCategory() {
        return category;
    }

    public String getProblem() {
        return problem;
    }

    public String getLandmark() {
        return landmark;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getAdminResponse() {
        return adminResponse;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setProblem(String problem) {
        this.problem = problem;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }
}