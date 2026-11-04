import { useState } from 'react';
import { SubmitEvent} from 'react';
import { DoctorProfile } from '../types';

interface Props {
  initialData: DoctorProfile | null;
  onSave: (profile: DoctorProfile) => void;
}

export function DoctorProfileForm({ initialData, onSave }: Props) {
  const [form, setForm] = useState<DoctorProfile>(
    initialData || {
      doctorFirstNames: '',
      doctorLastNames: '',
      universityDegrees: [''],
      professionalLicense: '',
      medicalOffice: '',
      address: '',
      phoneNumber: '',
      whatsapp: '',
      email: '',
    }
  );
  const [errorEmail, setErrorEmail] = useState('');
  const [errorDegrees, setErrorDegrees] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const universityDegrees = form.universityDegrees.map(degree => degree.trim()).filter(Boolean);
    if (universityDegrees.length === 0) {
      setErrorDegrees('Agrega al menos un título universitario.');
      return;
    }
    setErrorDegrees('');
    if (!validateEmail(form.email)) {
      setErrorEmail('El formato del correo electrónico no es válido.');
      return;
    }
    setErrorEmail('');
    onSave({ ...form, universityDegrees });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h2>Perfil Profesional del Médico</h2>
      
      <input type="text" placeholder="Nombre(s)" aria-label="Nombre(s) del médico" value={form.doctorFirstNames} onChange={e => setForm({...form, doctorFirstNames: e.target.value})} required />
      <input type="text" placeholder="Apellidos" aria-label="Apellidos del médico" value={form.doctorLastNames} onChange={e => setForm({...form, doctorLastNames: e.target.value})} required />
      <fieldset style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <legend>Títulos universitarios</legend>
        {form.universityDegrees.map((degree, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder={`Título ${index + 1}`}
              aria-label={`Título universitario ${index + 1}`}
              value={degree}
              onChange={e => setForm({
                ...form,
                universityDegrees: form.universityDegrees.map((current, currentIndex) =>
                  currentIndex === index ? e.target.value : current
                )
              })}
            />
            {form.universityDegrees.length > 1 && (
              <button
                type="button"
                onClick={() => setForm({
                  ...form,
                  universityDegrees: form.universityDegrees.filter((_, currentIndex) => currentIndex !== index)
                })}
              >
                Quitar
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setForm({
          ...form,
          universityDegrees: [...form.universityDegrees, '']
        })}>
          Agregar título
        </button>
        {errorDegrees && <p style={{ color: 'red' }}>{errorDegrees}</p>}
      </fieldset>
      <input type="text" placeholder="Cédula Profesional" value={form.professionalLicense} onChange={e => setForm({...form, professionalLicense: e.target.value})} required />
      <input type="text" placeholder="Consultorio / Clínica" value={form.medicalOffice} onChange={e => setForm({...form, medicalOffice: e.target.value})} required />
      <input type="text" placeholder="Dirección" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
      <input type="tel" placeholder="Teléfono" value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} required />
      <input type="tel" placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} required />
      <input type="email" placeholder="Correo electrónico" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
      
      {errorEmail && <p style={{ color: 'red' }}>{errorEmail}</p>}
      <button type="submit">Guardar Perfil</button>
      {success && <p style={{ color: 'green' }}>¡Perfil guardado con éxito!</p>}
    </form>
  );
}