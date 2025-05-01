package BackEnd.Rentary.Propertys.Service;

import BackEnd.Rentary.Propertys.DTOs.PropertyRequestDto;
import BackEnd.Rentary.Propertys.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Propertys.Repositoy.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements IPropertyService {

    private final PropertyRepository propertyRepository;

    @Override
    @Transactional
    public PropertyResponseDto createProperty(PropertyRequestDto propertyRequestDto) {
        return null;
    }

    @Override
    public PropertyResponseDto updateProperty(Long id, PropertyRequestDto propertyRequestDto) {
        return null;
    }

    @Override
    public void deleteProperty(Long id) {

    }
}