package BackEnd.Rentary.Propertys.Service;

import BackEnd.Rentary.Propertys.DTOs.PropertyRequestDto;
import BackEnd.Rentary.Propertys.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Propertys.Enums.TypeOfProperty;
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
