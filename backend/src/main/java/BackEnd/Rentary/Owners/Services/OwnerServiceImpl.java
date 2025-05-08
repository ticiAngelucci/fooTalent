package BackEnd.Rentary.Owners.Services;

import BackEnd.Rentary.Owners.DTOs.OwnerDto;
import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Owners.Repositories.OwnerRepository;
import BackEnd.Rentary.Propertys.DTOs.CustomPageResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerServiceImpl implements OwnerService{

    private final OwnerRepository ownerRepository;
    private final ModelMapper modelMapper;

    @Override
    public ResponseEntity<?> getOwnerId(Long id) {
        Optional<Owner> optionalOwner = ownerRepository.findById(id);
        if (optionalOwner.isPresent()){
            OwnerDto ownerDto = convertToDto(optionalOwner.get());
            return ResponseEntity.ok().body(ownerDto);
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<?> createOwner(OwnerDto ownerDto) {

        if (ownerRepository.existsByDni(ownerDto.getDni())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe un usuario con ese DNI");
        }

        Owner owner = convertToOwner(ownerDto);
        ownerRepository.save(owner);
        return ResponseEntity.status(HttpStatus.CREATED).body("Owner created");
    }

    @Override
    public ResponseEntity<?> deleteOwner(Long id) {

        Optional<Owner> optionalOwner = ownerRepository.findById(id);
        if (optionalOwner.isPresent()){
            ownerRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<?> updateOwner(Long id, OwnerDto ownerDto) {

        Optional<Owner> optionalOwner = ownerRepository.findById(id);

        if (optionalOwner.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario con el id " + id + " no existe");
        }

        Owner existingOwner = optionalOwner.get();
        String newDni = ownerDto.getDni();
        if (!newDni.equals(existingOwner.getDni()) && ownerRepository.existsByDni(newDni)) {
            return ResponseEntity.badRequest().body("El DNI ya está registrado por otro usuario");
        }

        Owner owner = convertToOwner(ownerDto);
        optionalOwner.get().setDni(owner.getDni());
        optionalOwner.get().setName(owner.getName());
        optionalOwner.get().setLastName(owner.getLastName());
        optionalOwner.get().setEmail(owner.getEmail());
        optionalOwner.get().setPhone(owner.getPhone());
        optionalOwner.get().setAddress(owner.getAddress());

        ownerRepository.save(optionalOwner.get());
        return ResponseEntity.ok().body(optionalOwner);
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

    private Owner convertToOwner (OwnerDto ownerDto) {
        return modelMapper.map(ownerDto, Owner.class);
    }

    private OwnerDto convertToDto (Owner owner) {
        return modelMapper.map(owner, OwnerDto.class);
    }

}
