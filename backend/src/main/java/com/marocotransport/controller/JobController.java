package com.maroctransit.auth.controller;

import com.maroctransit.auth.dto.ApiResponse;
import com.maroctransit.auth.dto.JobDTO;
import com.maroctransit.auth.dto.JobRequest;
import com.maroctransit.auth.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * REST Controller for managing jobs
 */
@RestController
@RequestMapping("/api/v1/jobs")
@Tag(name = "Job Management", description = "APIs for managing transport jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    /**
     * Create a new job (Shipper only)
     */
    @PostMapping
    @PreAuthorize("hasRole('SHIPPER')")
    @Operation(
        summary = "Create new job", 
        description = "Create a new transport job (Shipper only)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<JobDTO>> createJob(@Valid @RequestBody JobRequest jobRequest) {
        JobDTO createdJob = jobService.createJob(jobRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job created successfully", createdJob));
    }

    /**
     * Get all jobs with optional filtering
     */
    @GetMapping
    @Operation(
        summary = "Get all jobs", 
        description = "Get all jobs with optional filtering"
    )
    public ResponseEntity<ApiResponse<List<JobDTO>>> getAllJobs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<JobDTO> jobs = jobService.getAllJobs(status, origin, destination, page, size);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    /**
     * Get job by ID
     */
    @GetMapping("/{id}")
    @Operation(
        summary = "Get job by ID", 
        description = "Get detailed information about a specific job"
    )
    public ResponseEntity<ApiResponse<JobDTO>> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(job -> ResponseEntity.ok(ApiResponse.success(job)))
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Job not found with id: " + id)));
    }

    /**
     * Update job (Shipper can only update own jobs)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SHIPPER')")
    @Operation(
        summary = "Update job", 
        description = "Update an existing job (Shipper can only update own jobs)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<JobDTO>> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest jobRequest) {
        
        return jobService.updateJob(id, jobRequest)
                .map(job -> ResponseEntity.ok(ApiResponse.success("Job updated successfully", job)))
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Job not found or you don't have permission to update")));
    }

    /**
     * Delete job (Shipper can only delete own jobs)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SHIPPER')")
    @Operation(
        summary = "Delete job", 
        description = "Delete an existing job (Shipper can only delete own jobs)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        boolean deleted = jobService.deleteJob(id);
        
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", null));
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Job not found or you don't have permission to delete"));
        }
    }
}