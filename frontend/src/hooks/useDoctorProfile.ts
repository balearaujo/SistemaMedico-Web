import { useState } from "react";
import { DoctorProfile } from "../types";

export function useDoctorProfile () {
    const [profile, setProfile]= useState<DoctorProfile | null>(() => {
        const saved = localStorage.getItem('doctor_profile');
        if (!saved) return null;

        const parsed = JSON.parse(saved) as Partial<DoctorProfile> & {
            doctorsName?: string;
            degreeUniverity?: string;
        };

        return {
            doctorFirstNames: parsed.doctorFirstNames ?? parsed.doctorsName ?? '',
            doctorLastNames: parsed.doctorLastNames ?? '',
            universityDegrees: Array.isArray(parsed.universityDegrees)
                ? parsed.universityDegrees.filter((degree): degree is string => typeof degree === 'string')
                : parsed.degreeUniverity ? [parsed.degreeUniverity] : [],
            professionalLicense: parsed.professionalLicense ?? '',
            medicalOffice: parsed.medicalOffice ?? '',
            address: parsed.address ?? '',
            phoneNumber: parsed.phoneNumber ?? '',
            whatsapp: parsed.whatsapp ?? '',
            email: parsed.email ?? '',
        };
    });

    const saveProfile = (newProfile: DoctorProfile) => {
        localStorage.setItem('doctor_profile', JSON.stringify(newProfile));
        setProfile(newProfile);
    };

    return { profile, saveProfile };
}