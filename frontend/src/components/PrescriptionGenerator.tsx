import { useState } from 'react';
import {SubmitEvent} from 'react';
import { DoctorProfile, Prescription } from '../types';

interface Props {
  profile: DoctorProfile;
  onGeneratePrescription: (prescription: Prescription) => void; // Callback para emitir la receta
}

export function PrescriptionGenerator({ profile, onGeneratePrescription }: Props) {
  const [patientFirstNames, setPatientFirstNames] = useState('');
  const [patientLastNames, setPatientLastNames] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medicinePrescripted, setMedicine] = useState('');

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPrescription: Prescription = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      patientFirstNames,
      patientLastNames,
      diagnosis,
      medicinePrescripted,
      doctorSnapshot: { ...profile } // no se modifican los datos
    };
    onGeneratePrescription(newPrescription);
    setPatientFirstNames('');
    setPatientLastNames('');
    setDiagnosis('');
    setMedicine('');
    alert('¡Receta emitida con éxito!');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', border: '1px solid #ccc', padding: '20px' }}>
      {}
      <div style={{ background: '#f4f4f4', padding: '15px', borderBottom: '2px solid #333', marginBottom: '15px' }}>
        <h3>{profile.doctorFirstNames} {profile.doctorLastNames}</h3>
        <p>{profile.universityDegrees.join(' | ')} | Cédula: {profile.professionalLicense}</p>
        <p><strong>{profile.medicalOffice}</strong> - {profile.address}</p>
        <p>Tel: {profile.phoneNumber} | WA: {profile.whatsapp} | Email: {profile.email}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3>Generar Receta Médica</h3>
        <input type="text" placeholder="Nombre(s) del paciente" value={patientFirstNames} onChange={e => setPatientFirstNames(e.target.value)} required />
        <input type="text" placeholder="Apellidos del paciente" value={patientLastNames} onChange={e => setPatientLastNames(e.target.value)} required />
        <textarea placeholder="Diagnóstico" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required />
        <textarea placeholder="Medicamentos e indicaciones" value={medicinePrescripted} onChange={e => setMedicine(e.target.value)} required />
        <button type="submit">Emitir Receta</button>
      </form>
    </div>
  );
}