package BackEnd.Rentary.Contracts.DTOs;

import BackEnd.Rentary.Common.DTOs.DocumentDto;
import BackEnd.Rentary.Contracts.Enums.AdjustmentFrequency;
import BackEnd.Rentary.Contracts.Enums.AdjustmentType;

import java.time.LocalDate;
import java.util.List;

public record ContractResponse(
        Long id,
        String propertyAddress,
        String tenantFullName,
        LocalDate startDate,
        LocalDate endDate,
        double value,
        double baseRent,
        AdjustmentFrequency adjustmentFrequency,
        int deadline,
        boolean active,
        double adjustmentPercentage,
        String adjustmentType,
        List<DocumentDto> documents
) {}
