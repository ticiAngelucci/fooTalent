package BackEnd.Rentary.Owners.Services;

import BackEnd.Rentary.Owners.DTOs.OwnerDto;
import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Owners.Repositories.OwnerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OwnerServiceImpl implements OwnerService{

    private final OwnerRepository ownerRepository;
    private final ModelMapper modelMapper;

    public OwnerServiceImpl(OwnerRepository ownerRepository, ModelMapper modelMapper) {
        this.ownerRepository = ownerRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<OwnerDto> getOwner() {

        List<OwnerDto> ownerList = ownerRepository.findAll()
                .stream()
                .map(owner -> convertToDto(owner))
                .collect(Collectors.toList());
        return ownerList;
    }

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
        if (optionalOwner.isPresent()){
            Owner owner = convertToOwner(ownerDto);
            optionalOwner.get().setDni(owner.getDni());
            optionalOwner.get().setName(owner.getName());
            optionalOwner.get().setLastName(owner.getLastName());
            optionalOwner.get().setEmail(owner.getEmail());
            optionalOwner.get().setPhone(owner.getPhone());
            /*optionalOwner.get().setProperty(ownerDto.getProperty());*/


            return ResponseEntity.ok().body(optionalOwner);
        }

        return ResponseEntity.notFound().build();
    }

    private Owner convertToOwner (OwnerDto ownerDto) {
        return modelMapper.map(ownerDto, Owner.class);
    }

    private OwnerDto convertToDto (Owner owner) {
        return modelMapper.map(owner, OwnerDto.class);
    }

}
