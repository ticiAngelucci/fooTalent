package BackEnd.Rentary.Propertys.Service;

import BackEnd.Rentary.Propertys.DTOs.PropertyRequestDto;
import BackEnd.Rentary.Propertys.DTOs.PropertyResponseDto;

public interface IPropertyService {
    PropertyResponseDto createProperty(PropertyRequestDto propertyRequestDto);
    /*PropertyResponseDto changePropertyStatus ();*/
    PropertyResponseDto updateProperty(Long id, PropertyRequestDto propertyRequestDto);
    void deleteProperty(Long id);


   /* PropertyResponseDto getPropertyById(Long id);
    PropertyResponseDto getAllProperties();
    PropertyResponseDto getPropertiesByStatus(String status);*/
}