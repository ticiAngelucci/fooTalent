package BackEnd.Rentary.Contracts.DTOs;

import BackEnd.Rentary.Common.DTOs.DocumentDto;
import BackEnd.Rentary.Contracts.Enums.AdjustmentFrequency;

import java.time.LocalDate;
import java.util.List;

public record ContractResponse(
        Long id,
        Long propertyId,
        Long tenantId,
        LocalDate startDate,
        LocalDate endDate,
        double value,
        double baseRent,
        AdjustmentFrequency adjustmentFrequency,
        int deadline,
        boolean active,
        double adjustmentPercentage,
        List<DocumentDto> documents
) {}
