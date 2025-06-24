package com.marocotransport.controller;

import com.marocotransport.auth.dto.ApiResponse;
import com.marocotransport.auth.dto.MatchingRequestDTO;
import com.marocotransport.auth.dto.MatchingResultDTO;
import com.marocotransport.auth.service.MatchingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * REST Controller for ML-based job-truck matching
 */
@RestController
@RequestMapping("/api/v1/matching")
@Tag(name = "ML Matching", description = "APIs for ML-based carrier-shipper matching")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    /**
     * Match jobs to available trucks using ML
     */
    @PostMapping("/jobs-to-trucks")
    @PreAuthorize("hasRole('SHIPPER')")
    @Operation(
        summary = "Match jobs to trucks", 
        description = "Find best trucks for specific jobs using ML matching algorithm",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<List<MatchingResultDTO>>> matchJobsToTrucks(
            @Valid @RequestBody MatchingRequestDTO matchingRequest) {
        
        List<MatchingResultDTO> matchingResults = matchingService.matchJobsToTrucks(
                matchingRequest.getJobIds(), 
                matchingRequest.getParameters());
        
        return ResponseEntity.ok(ApiResponse.success("Matching completed successfully", matchingResults));
    }

    /**
     * Match trucks to available jobs using ML
     */
    @PostMapping("/trucks-to-jobs")
    @PreAuthorize("hasRole('CARRIER')")
    @Operation(
        summary = "Match trucks to jobs", 
        description = "Find best jobs for specific trucks using ML matching algorithm",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<List<MatchingResultDTO>>> matchTrucksToJobs(
            @Valid @RequestBody MatchingRequestDTO matchingRequest) {
        
        List<MatchingResultDTO> matchingResults = matchingService.matchTrucksToJobs(
                matchingRequest.getTruckIds(), 
                matchingRequest.getParameters());
        
        return ResponseEntity.ok(ApiResponse.success("Matching completed successfully", matchingResults));
    }

    /**
     * Get matching recommendations based on historical data
     */
    @GetMapping("/recommendations")
    @PreAuthorize("hasAnyRole('SHIPPER', 'CARRIER')")
    @Operation(
        summary = "Get recommendations", 
        description = "Get personalized recommendations based on historical data",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<List<MatchingResultDTO>>> getRecommendations(
            @RequestParam(defaultValue = "5") int limit) {
        
        List<MatchingResultDTO> recommendations = matchingService.getRecommendations(limit);
        
        return ResponseEntity.ok(ApiResponse.success("Recommendations generated successfully", recommendations));
    }

    /**
     * Get matching analytics and insights
     */
    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('SHIPPER', 'CARRIER', 'ADMIN')")
    @Operation(
        summary = "Get matching analytics", 
        description = "Get analytics and insights about matching patterns",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<Object>> getMatchingAnalytics() {
        Object analytics = matchingService.getMatchingAnalytics();
        
        return ResponseEntity.ok(ApiResponse.success("Analytics generated successfully", analytics));
    }
}
