package BackEnd.Rentary.Owners.Services;

import BackEnd.Rentary.Exceptions.DuplicateDniException;
import BackEnd.Rentary.Exceptions.OwnerNotFoundException;
import BackEnd.Rentary.Owners.DTOs.OwnerDto;
import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Owners.Repositories.OwnerRepository;
import BackEnd.Rentary.Propertys.DTOs.CustomPageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OwnerServiceImpl implements OwnerService{

    private final OwnerRepository ownerRepository;
    private final ModelMapper modelMapper;

    @Override
    public ResponseEntity<?> getOwnerId(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new OwnerNotFoundException("No se encontró propietario con ID: " + id));

        OwnerDto ownerDto = convertToDto(owner);
        return ResponseEntity.ok().body(ownerDto);
    }

    @Override
    public ResponseEntity<?> createOwner(OwnerDto ownerDto) {
        if (ownerRepository.existsByDni(ownerDto.getDni())) {
            throw new DuplicateDniException("Ya existe un propietario con DNI: " + ownerDto.getDni());
        }

        Owner owner = convertToOwner(ownerDto);
        ownerRepository.save(owner);

        log.info("Propietario creado con DNI: {}", ownerDto.getDni());
        return ResponseEntity.status(HttpStatus.CREATED).body("Propietario creado exitosamente");
    }

    @Override
    public ResponseEntity<?> deleteOwner(Long id) {
        if (!ownerRepository.existsById(id)) {
            throw new OwnerNotFoundException("No se encontró propietario con ID: " + id);
        }

        ownerRepository.deleteById(id);
        log.info("Propietario eliminado con ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<?> updateOwner(Long id, OwnerDto ownerDto) {
        Owner existingOwner = ownerRepository.findById(id)
                .orElseThrow(() -> new OwnerNotFoundException("No se encontró propietario con ID: " + id));

        String newDni = ownerDto.getDni();
        if (!newDni.equals(existingOwner.getDni()) && ownerRepository.existsByDni(newDni)) {
            throw new DuplicateDniException("El DNI " + newDni + " ya está registrado por otro propietario");
        }

        // Actualizar propiedades
        existingOwner.setDni(ownerDto.getDni());
        existingOwner.setName(ownerDto.getName());
        existingOwner.setLastName(ownerDto.getLastName());
        existingOwner.setEmail(ownerDto.getEmail());
        existingOwner.setPhone(ownerDto.getPhone());
        existingOwner.setAddress(ownerDto.getAddress());

        ownerRepository.save(existingOwner);

        log.info("Propietario actualizado con ID: {}", id);
        return ResponseEntity.ok().body(convertToDto(existingOwner));
    }

    @Override
    public CustomPageResponse<OwnerDto> getOwner(Pageable pageable) {
        Page<Owner> ownerPage = ownerRepository.findAll(
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("id").descending())
        );

        List<OwnerDto> dtos = ownerPage
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new CustomPageResponse<>(
                dtos,
                ownerPage.getTotalPages(),
                ownerPage.getTotalElements(),
                ownerPage.getNumber()
        );
    }

    private Owner convertToOwner(OwnerDto ownerDto) {
        return modelMapper.map(ownerDto, Owner.class);
    }

    private OwnerDto convertToDto(Owner owner) {
        return modelMapper.map(owner, OwnerDto.class);
    }
}