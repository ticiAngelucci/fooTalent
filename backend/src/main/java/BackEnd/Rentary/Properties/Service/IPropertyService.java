package BackEnd.Rentary.Properties.Service;

import BackEnd.Rentary.Properties.DTOs.PropertyRequestDto;
import BackEnd.Rentary.Properties.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Properties.Enums.TypeOfProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IPropertyService {
    PropertyResponseDto createProperty(PropertyRequestDto dto, Long userId);
    void deleteProperty(Long id);
    Page<PropertyResponseDto> getAllActivePropertiesFiltered(String locality, TypeOfProperty type, Pageable pageable);
    PropertyResponseDto updateProperty(Long propertyId, PropertyRequestDto dto);
    Page<PropertyResponseDto> getAllProperties(Pageable pageable);
    PropertyResponseDto getPropertyById(Long id);
}
