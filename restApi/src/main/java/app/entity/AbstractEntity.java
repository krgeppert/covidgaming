package app.entity;

import app.dto.EntityDto;

import javax.persistence.*;
import java.util.Date;

@MappedSuperclass
public abstract class AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    protected long id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    protected Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    protected Date lastModifiedDate;


    @PrePersist
    public void onPrePersist() {
        Date createdDate = new Date();
        this.createdDate = createdDate;
        this.lastModifiedDate = createdDate;
    }

    @PreUpdate
    public void onPreUpdate() {
        this.lastModifiedDate = new Date();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public abstract EntityDto toDto();

    protected void setRootDtoAttributes(EntityDto dto) {
        dto.setId(id);
        dto.setCreatedDate(createdDate);
        dto.setLastModifiedDate(lastModifiedDate);
    }
}
