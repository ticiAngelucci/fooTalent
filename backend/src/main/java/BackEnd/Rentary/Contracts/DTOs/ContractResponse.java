package BackEnd.Rentary.Contracts.DTOs;

import BackEnd.Rentary.Common.DTOs.DocumentDto;
import BackEnd.Rentary.Contracts.Enums.AdjustmentFrequency;

import java.time.LocalDate;
import java.util.List;

public record ContractResponse(
        Long id,
        Long propertyId,
        Long tenantId,
        Long ownerId,
        String ownerFullName,
        String propertyAddress,
        String tenantFullName,
        LocalDate startDate,
        LocalDate endDate,
        double baseRent,
        double deposit,
        AdjustmentFrequency adjustmentFrequency,
        int deadline,
        boolean active,
        double adjustmentPercentage,
        String adjustmentType,
        List<DocumentDto> documents
) {}
