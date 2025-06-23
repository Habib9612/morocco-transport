package com.marocotransport.controller;

import com.maroctransit.auth.dto.ApiResponse;
import com.maroctransit.auth.dto.TruckDTO;
import com.maroctransit.auth.dto.TruckRequest;
import com.maroctransit.auth.dto.TruckAvailabilityRequest;
import com.maroctransit.auth.service.TruckService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * REST Controller for managing trucks
 */
@RestController
@RequestMapping("/api/v1/trucks")
@Tag(name = "Truck Management", description = "APIs for managing trucks and their availability")
public class TruckController {

    private final TruckService truckService;

    public TruckController(TruckService truckService) {
        this.truckService = truckService;
    }

    /**
     * Register a new truck (Carrier only)
     */
    @PostMapping
    @PreAuthorize("hasRole('CARRIER')")
    @Operation(
        summary = "Register new truck", 
        description = "Register a new truck (Carrier only)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<TruckDTO>> registerTruck(@Valid @RequestBody TruckRequest truckRequest) {
        TruckDTO registeredTruck = truckService.registerTruck(truckRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Truck registered successfully", registeredTruck));
    }

    /**
     * Get all trucks with optional filtering
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('CARRIER', 'ADMIN')")
    @Operation(
        summary = "Get all trucks", 
        description = "Get all trucks with optional filtering (Carrier sees only their trucks)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<List<TruckDTO>>> getAllTrucks(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean available,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<TruckDTO> trucks = truckService.getAllTrucks(type, location, available, page, size);
        return ResponseEntity.ok(ApiResponse.success(trucks));
    }

    /**
     * Get truck by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CARRIER', 'ADMIN')")
    @Operation(
        summary = "Get truck by ID", 
        description = "Get detailed information about a specific truck",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<TruckDTO>> getTruckById(@PathVariable Long id) {
        return truckService.getTruckById(id)
                .map(truck -> ResponseEntity.ok(ApiResponse.success(truck)))
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Truck not found with id: " + id)));
    }

    /**
     * Update truck (Carrier can only update own trucks)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CARRIER')")
    @Operation(
        summary = "Update truck", 
        description = "Update an existing truck (Carrier can only update own trucks)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<TruckDTO>> updateTruck(
            @PathVariable Long id,
            @Valid @RequestBody TruckRequest truckRequest) {
        
        return truckService.updateTruck(id, truckRequest)
                .map(truck -> ResponseEntity.ok(ApiResponse.success("Truck updated successfully", truck)))
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Truck not found or you don't have permission to update")));
    }

    /**
     * Update truck availability
     */
    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('CARRIER')")
    @Operation(
        summary = "Update truck availability", 
        description = "Update truck availability status (Carrier only)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<TruckDTO>> updateTruckAvailability(
            @PathVariable Long id,
            @Valid @RequestBody TruckAvailabilityRequest availabilityRequest) {
        
        return truckService.updateTruckAvailability(id, availabilityRequest)
                .map(truck -> ResponseEntity.ok(ApiResponse.success("Truck availability updated", truck)))
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Truck not found or you don't have permission to update")));
    }

    /**
     * Delete truck (Carrier can only delete own trucks)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CARRIER')")
    @Operation(
        summary = "Delete truck", 
        description = "Delete an existing truck (Carrier can only delete own trucks)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<Void>> deleteTruck(@PathVariable Long id) {
        boolean deleted = truckService.deleteTruck(id);
        
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success("Truck deleted successfully", null));
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Truck not found or you don't have permission to delete"));
        }
    }
}