package BackEnd.Rentary.Contracts.Entity;

import BackEnd.Rentary.Contracts.Enums.AdjustmentFrequency;
import BackEnd.Rentary.Propertys.Entities.Property;
import BackEnd.Rentary.Tenants.entities.Tenants;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class Contract {
    private Long contractId;
    private Property property;
    private Tenants tenant;
    private Date startDate;
    private Date endDate;
    private double value;
    private double baseRent;
    private AdjustmentFrequency adjustmentFrequency;
    private int deadline;
}
