export interface DoctorProfile {
    doctorFirstNames: string;
    doctorLastNames: string;
    universityDegrees: string[];
    professionalLicense: string;
    medicalOffice: string;
    address: string;
    phoneNumber: string;
    whatsapp: string;
    email: string;
}

export interface Prescription {
    id: string;
    date: string;
    patientFirstNames: string;
    patientLastNames: string;
    diagnosis: string;
    medicinePrescripted: string;
    doctorSnapshot: DoctorProfile;

}