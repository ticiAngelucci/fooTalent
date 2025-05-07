package BackEnd.Rentary.Propertys.Service;

import BackEnd.Rentary.Propertys.DTOs.PropertyRequestDto;
import BackEnd.Rentary.Propertys.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Propertys.Enums.PropertyStatus;
import BackEnd.Rentary.Propertys.Enums.TypeOfProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IPropertyService {
    PropertyResponseDto createProperty(PropertyRequestDto dto, Long userId);
    PropertyResponseDto changePropertyStatus (Long propertyId, PropertyStatus newStatus);
    void deleteProperty(Long id);
    Page<PropertyResponseDto> getAllActivePropertiesFiltered(String locality, TypeOfProperty type, Pageable pageable);

}
