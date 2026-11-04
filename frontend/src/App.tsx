import { useState } from 'react';
import { useDoctorProfile } from './hooks/useDoctorProfile';
import { DoctorProfileForm } from './components/DoctorProfileForm';
import { PrescriptionGenerator } from './components/PrescriptionGenerator';
import { Prescription } from './types';

export default function App() {
  const { profile, saveProfile } = useDoctorProfile();
  const [recetas, setRecetas] = useState<Prescription[]>([]);
  const [vista, setVista] = useState<'perfil' | 'receta' | 'historial'>('perfil');

  if (!profile) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Configuración Inicial Requerida</h2>
        <p>Registra tus datos profesionales por única vez para empezar a emitir recetas.</p>
        <DoctorProfileForm initialData={null} onSave={saveProfile} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setVista('perfil')}>Editar Mi Perfil</button>
        <button onClick={() => setVista('receta')}>Nueva Receta</button>
        <button onClick={() => setVista('historial')}>Historial ({recetas.length})</button>
      </nav>

      {vista === 'perfil' && <DoctorProfileForm initialData={profile} onSave={saveProfile} />}
      {vista === 'receta' && <PrescriptionGenerator profile={profile} onGeneratePrescription={(r) => setRecetas([r, ...recetas])} />}
      {vista === 'historial' && (
        <div>
          <h2>Historial de Recetas (Prueba de Versiones Históricas)</h2>
          {recetas.length === 0 ? <p>No hay recetas emitidas aún.</p> : null}
          {recetas.map(receta => (
            <div key={receta.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
              <p><strong>Fecha:</strong> {receta.date} | <strong>Paciente:</strong> {receta.patientFirstNames} {receta.patientLastNames}</p>
              <div style={{ background: '#eee', padding: '10px', fontSize: '0.9em' }}>
                <small>Datos del médico impresos en esta receta específica:</small>
                <p><strong>{receta.doctorSnapshot.doctorFirstNames} {receta.doctorSnapshot.doctorLastNames}</strong> - Consultorio: {receta.doctorSnapshot.medicalOffice} (Tel: {receta.doctorSnapshot.phoneNumber})</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}