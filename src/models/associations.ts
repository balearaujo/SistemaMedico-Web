import Patient from "./patient.models.ts";
import Medicine from "./medicine.models.ts";
import Consultation from "./consultation.models.ts";
import Prescription from "./prescription.models.ts";
import PrescriptionDetail from "./prescriptionDetail.models.ts";

let associationsInitialized = false;

export function setupAssociations(): void{
    if (associationsInitialized) return;

    Patient.hasMany(Consultation, {
        foreignKey: "id_patient",
        as: "patient",
    });

    Consultation.hasMany(Prescription, {
        foreignKey: "id_consultation",
        as: "prescriptions",
    });

    Prescription.belongsTo(Consultation, {
        foreignKey: "id_consultation",
        as: "consultation",
    });

    Prescription.hasMany(Prescription, {
        foreignKey: "id_origin_prescription",
        as: "controlled_prescriptions",
    });
    
    Prescription.belongsTo(Prescription, {
        foreignKey: "id_origin_prescription",
        as: "origin_prescription",
    });

    Prescription.hasMany(PrescriptionDetail, {
        foreignKey: "id_prescription",
        as: "details",
    });

    PrescriptionDetail.belongsTo(Prescription, {
        foreignKey: "id_prescription",
        as: "prescription",
    });

    Medicine.hasMany(PrescriptionDetail, {
        foreignKey: "id_medication",
        as: "prescription_items",
    });

    PrescriptionDetail.belongsTo(Medicine, {
        foreignKey: "id_medication",
        as: "medication",
    });

    associationsInitialized = true;
}