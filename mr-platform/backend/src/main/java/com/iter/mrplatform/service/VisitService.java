package com.iter.mrplatform.service;

import com.iter.mrplatform.dto.VisitCheckInRequest;
import com.iter.mrplatform.dto.VisitCheckOutRequest;
import com.iter.mrplatform.entity.Doctor;
import com.iter.mrplatform.entity.User;
import com.iter.mrplatform.entity.Visit;
import com.iter.mrplatform.entity.VisitStatus;
import com.iter.mrplatform.repository.DoctorRepository;
import com.iter.mrplatform.repository.VisitRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitService {

    /** Doctor visit is considered valid if MR checked in within this radius. */
    private static final double GEOFENCE_RADIUS_METERS = 300.0;

    private final VisitRepository visitRepository;
    private final DoctorRepository doctorRepository;
    private final CurrentUserService currentUserService;

    public Visit checkIn(VisitCheckInRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found: " + request.getDoctorId()));
        User rep = currentUserService.get();

        Visit visit = new Visit();
        visit.setDoctor(doctor);
        visit.setRepresentative(rep);
        visit.setCheckInTime(LocalDateTime.now());
        visit.setCheckInLat(request.getLatitude());
        visit.setCheckInLng(request.getLongitude());

        if (doctor.getLatitude() != null && doctor.getLongitude() != null) {
            double distance = GeoUtils.distanceMeters(
                    request.getLatitude(), request.getLongitude(),
                    doctor.getLatitude(), doctor.getLongitude());
            visit.setGeofenceDistanceMeters(distance);
            visit.setWithinGeofence(distance <= GEOFENCE_RADIUS_METERS);
        } else {
            // No registered coordinates for this doctor yet - cannot validate, flag for review.
            visit.setWithinGeofence(false);
        }

        visit.setStatus(VisitStatus.DRAFT);
        return visitRepository.save(visit);
    }

    public Visit checkOut(Long visitId, VisitCheckOutRequest request) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new EntityNotFoundException("Visit not found: " + visitId));

        visit.setCheckOutTime(LocalDateTime.now());
        visit.setCheckOutLat(request.getLatitude());
        visit.setCheckOutLng(request.getLongitude());
        if (request.getProductsDiscussed() != null) {
            visit.setProductsDiscussed(request.getProductsDiscussed());
        }
        visit.setNotes(request.getNotes());
        visit.setStatus(request.isSubmit() ? VisitStatus.SUBMITTED : VisitStatus.DRAFT);

        return visitRepository.save(visit);
    }

    public List<Visit> myVisits() {
        return visitRepository.findByRepresentativeId(currentUserService.get().getId());
    }

    public List<Visit> all() {
        return visitRepository.findAll();
    }
}
