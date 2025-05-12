package BackEnd.Rentary.Owners.Services;

import BackEnd.Rentary.Exceptions.DuplicateDniException;
import BackEnd.Rentary.Exceptions.OwnerNotFoundException;
import BackEnd.Rentary.Owners.DTOs.OwnerRequestDto;
import BackEnd.Rentary.Owners.DTOs.OwnerResponseDto;
import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Owners.Mapper.OwnerMapper;
import BackEnd.Rentary.Owners.Repositories.OwnerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OwnerServiceImpl implements OwnerService{

    private final OwnerRepository ownerRepository;
    private final OwnerMapper ownerMapper;

    @Override
    public ResponseEntity<?> getOwnerId(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new OwnerNotFoundException("No se encontró propietario con ID: " + id));

        OwnerResponseDto ownerDto = ownerMapper.toDto(owner);
        return ResponseEntity.ok().body(ownerDto);
    }

    @Override
    public ResponseEntity<?> createOwner(OwnerRequestDto ownerDto) {
        if (ownerRepository.existsByDni(ownerDto.dni())) {
            throw new DuplicateDniException("Ya existe un propietario con DNI: " + ownerDto.dni());
        }

        Owner owner = ownerMapper.toEntity(ownerDto);
        ownerRepository.save(owner);

        return ResponseEntity.status(HttpStatus.CREATED).body("Propietario creado exitosamente");
    }

    @Override
    public ResponseEntity<?> deleteOwner(Long id) {
        if (!ownerRepository.existsById(id)) {
            throw new OwnerNotFoundException("No se encontró propietario con ID: " + id);
        }

        ownerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<?> updateOwner(Long id, OwnerRequestDto ownerDto) {
        Owner existingOwner = ownerRepository.findById(id)
                .orElseThrow(() -> new OwnerNotFoundException("No se encontró propietario con ID: " + id));

        String newDni = ownerDto.dni();
        if (!newDni.equals(existingOwner.getDni()) && ownerRepository.existsByDni(newDni)) {
            throw new DuplicateDniException("El DNI " + newDni + " ya está registrado por otro propietario");
        }

        existingOwner.setDni(ownerDto.dni());
        existingOwner.setFirstName(ownerDto.firstName());
        existingOwner.setLastName(ownerDto.lastName());
        existingOwner.setEmail(ownerDto.email());
        existingOwner.setPhone(ownerDto.phone());
        existingOwner.setAddress(ownerDto.address());
        existingOwner.setAttachedDocument(ownerDto.attachedDocument());

        ownerRepository.save(existingOwner);

        return ResponseEntity.ok().body(ownerMapper.toDto(existingOwner));
    }

    @Override
    public Page<OwnerResponseDto> getOwner(Pageable pageable) {
        return ownerRepository.findAll(pageable)
                .map(ownerMapper::toDto);
    }
}