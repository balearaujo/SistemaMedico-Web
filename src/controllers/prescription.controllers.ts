import type { Request, Response } from "express";
import sequelizeConnection from "../conf/sequelize.connection.ts";
import { setupAssociations } from "../models/associations.ts";
import Patient from "../models/patient.models.ts";
import Medicine from "../models/medicine.models.ts";
import Consultation from "../models/consultation.models.ts";
import Prescription from "../models/prescription.models.ts";
import PrescriptionDetail from "../models/prescriptionDetail.models.ts";
import AuditLog from "../models/auditLog.models.ts";

setupAssociations();

const sequelize = sequelizeConnection.getSequelize();

const DEFAULT_MEDICAL_SNAPSHOT = {
  full_name: "Dr. Alejandro Martínez Gómez",
  address: "Av. Universidad 1001, Fracc. Bosques del Prado, Aguascalientes, Ags.",
  office: "Torre Médica Consultorio 304",
  office_phone: "4499123456",
  whatsapp: "4491987654",
  email: "dr.martinez@clinicamedica.mx",
  titles: [
    { title: "Médico Cirujano", university: "UAA", license: "8451236" },
    { title: "Especialidad en Medicina Interna", university: "UNAM", license: "10948273" },
  ],
};

export class PrescriptionController {
  constructor() {}

  public async getLastPrescriptionByPatient(req: Request, res: Response) {
    try {
      const patientId = Number(req.params.patientId);
      if (isNaN(patientId) || patientId <= 0) {
        return res.status(400).json({ message: "Invalid patient ID" });
      }

      const lastConsultation: any = await Consultation.findOne({
        where: { id_patient: patientId },
        attributes: ["id_consultation", "id_patient", "consultation_date", "diagnosis"],
        include: [
          {
            model: Prescription,
            as: "prescriptions",
            include: [
              {
                model: PrescriptionDetail,
                as: "details",
                include: [
                  {
                    model: Medicine,
                    as: "medication",
                  },
                ],
              },
            ],
          },
        ],
        order: [
          ["consultation_date", "DESC"],
          ["id_consultation", "DESC"],
        ],
      });

      if (!lastConsultation) {
        return res.status(404).json({
          is_subsequent: false,
          message: "No previous consultations found for this patient (First-time patient)",
        });
      }

      const preloadedMedications: any[] = [];
      for (const presc of lastConsultation.prescriptions || []) {
        for (const detail of presc.details || []) {
          preloadedMedications.push({
            id_medication: detail.id_medication,
            brand_name: detail.medication?.brand_name,
            generic_name: detail.medication?.generic_name,
            presentation: detail.medication?.presentation,
            is_controlled: detail.medication?.is_controlled,
            dose: detail.dose,
            route_administration: detail.route_administration,
            dosing_frequency: detail.dosing_frequency,
            duration: detail.duration,
          });
        }
      }

      const idUser = Number(req.body?.id_user || req.query?.id_user) || 1;
      await AuditLog.create({
        id_user: idUser,
        med_action: "CONSULTA_EXPEDIENTE",
        affected_entity: "patients",
        id_affected_registry: patientId,
        details: "Precarga de expediente subsecuente de consulta #" + String(lastConsultation.id_consultation),
      });

      return res.status(200).json({
        is_subsequent: true,
        id_patient: patientId,
        last_consultation_id: lastConsultation.id_consultation,
        last_consultation_date: lastConsultation.consultation_date,
        preloaded_diagnosis: lastConsultation.diagnosis,
        preloaded_medications: preloadedMedications,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async createPrescription(req: Request, res: Response) {
    const transaction = await sequelize.transaction();
    try {
      const {
        id_patient,
        id_doctor = 1,
        id_user = 1,
        id_med_app = null,
        diagnosis,
        blood_pressure = null,
        pulse = null,
        body_temperature = null,
        body_weight = null,
        body_height = null,
        medical_snapshot = DEFAULT_MEDICAL_SNAPSHOT,
        items,
      } = req.body;

      if (!id_patient || !diagnosis || !Array.isArray(items) || items.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          message: "id_patient, diagnosis and at least one medication item are required",
        });
      }

      const patientExists = await Patient.findByPk(Number(id_patient), { transaction });
      if (!patientExists) {
        await transaction.rollback();
        return res.status(404).json({ message: "Patient not found" });
      }

      const generalItems: any[] = [];
      const controlledItems: any[] = [];

      for (const item of items) {
        if (
          !item.id_medication ||
          !item.dose ||
          !item.route_administration ||
          !item.dosing_frequency ||
          !item.duration
        ) {
          await transaction.rollback();
          return res.status(400).json({
            message:
              "Each medication item requires id_medication, dose, route_administration, dosing_frequency and duration",
          });
        }

        const med: any = await Medicine.findByPk(Number(item.id_medication), { transaction });
        if (!med) {
          await transaction.rollback();
          return res.status(404).json({
            message: `Medication with ID ${item.id_medication} not found`,
          });
        }

        if (med.is_controlled) {
          controlledItems.push({ ...item, medication: med });
        } else {
          generalItems.push({ ...item, medication: med });
        }
      }

      const newConsultation: any = await Consultation.create(
        {
          id_patient: Number(id_patient),
          id_doctor: Number(id_doctor),
          id_med_app: id_med_app ? Number(id_med_app) : null,
          diagnosis: String(diagnosis).trim(),
          blood_pressure,
          pulse,
          body_temperature,
          body_weight,
          body_height,
        },
        { transaction }
      );

      const createdPrescriptions: any[] = [];
      let originPrescriptionId: number | null = null;

      if (generalItems.length > 0) {
        const generalPrescription: any = await Prescription.create(
          {
            id_consultation: newConsultation.id_consultation,
            id_origin_prescription: null,
            is_controlled: false,
            medical_snapshot,
          },
          { transaction }
        );

        originPrescriptionId = generalPrescription.id_prescription;

        const detailsCreated: any[] = [];
        for (const gItem of generalItems) {
          const detail = await PrescriptionDetail.create(
            {
              id_prescription: generalPrescription.id_prescription,
              id_medication: Number(gItem.id_medication),
              dose: gItem.dose,
              route_administration: gItem.route_administration,
              dosing_frequency: gItem.dosing_frequency,
              duration: gItem.duration,
            },
            { transaction }
          );
          detailsCreated.push(detail);
        }

        await AuditLog.create(
          {
            id_user: Number(id_user),
            med_action: "EMISION_RECETA",
            affected_entity: "prescriptions",
            id_affected_registry: generalPrescription.id_prescription,
            details: "Emisión de receta general en consulta #" + String(newConsultation.id_consultation),
          },
          { transaction }
        );

        createdPrescriptions.push({
          ...generalPrescription.toJSON(),
          details: detailsCreated,
        });
      }

      for (const cItem of controlledItems) {
        const controlledPrescription: any = await Prescription.create(
          {
            id_consultation: newConsultation.id_consultation,
            id_origin_prescription: originPrescriptionId,
            is_controlled: true,
            medical_snapshot,
          },
          { transaction }
        );

        const cDetail = await PrescriptionDetail.create(
          {
            id_prescription: controlledPrescription.id_prescription,
            id_medication: Number(cItem.id_medication),
            dose: cItem.dose,
            route_administration: cItem.route_administration,
            dosing_frequency: cItem.dosing_frequency,
            duration: cItem.duration,
          },
          { transaction }
        );

        await AuditLog.create(
          {
            id_user: Number(id_user),
            med_action: "EMISION_RECETA",
            affected_entity: "prescriptions",
            id_affected_registry: controlledPrescription.id_prescription,
            details: originPrescriptionId
              ? "Emisión de receta controlada ligada a receta general #" + String(originPrescriptionId)
              : "Emisión de receta controlada individual en consulta #" + String(newConsultation.id_consultation),
          },
          { transaction }
        );

        createdPrescriptions.push({
          ...controlledPrescription.toJSON(),
          details: [cDetail],
        });
      }

      await transaction.commit();

      return res.status(201).json({
        message: "Consultation and prescriptions created successfully",
        consultation: newConsultation,
        total_prescriptions_generated: createdPrescriptions.length,
        prescriptions: createdPrescriptions,
      });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getPatientPrescriptionHistory(req: Request, res: Response) {
    try {
      const patientId = Number(req.params.patientId);
      if (isNaN(patientId) || patientId <= 0) {
        return res.status(400).json({ message: "Invalid patient ID" });
      }

      const history = await Consultation.findAll({
        where: { id_patient: patientId },
        include: [
          {
            model: Prescription,
            as: "prescriptions",
            include: [
              {
                model: PrescriptionDetail,
                as: "details",
                include: [{ model: Medicine, as: "medication" }],
              },
            ],
          },
        ],
        order: [["consultation_date", "DESC"]],
      });

      return res.status(200).json(history);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getPrescriptionById(req: Request, res: Response) {
    try {
      const prescriptionId = Number(req.params.id);
      if (isNaN(prescriptionId) || prescriptionId <= 0) {
        return res.status(400).json({ message: "Invalid prescription ID" });
      }

      const prescription = await Prescription.findByPk(prescriptionId, {
        include: [
          {
            model: Consultation,
            as: "consultation",
            include: [{ model: Patient, as: "patient" }],
          },
          {
            model: PrescriptionDetail,
            as: "details",
            include: [{ model: Medicine, as: "medication" }],
          },
          {
            model: Prescription,
            as: "controlled_prescriptions",
          },
        ],
      });

      if (!prescription) {
        return res.status(404).json({ message: "Prescription not found" });
      }

      if (req.query.reprint === "true") {
        const idUser = Number(req.query.id_user) || 1;
        await AuditLog.create({
          id_user: idUser,
          med_action: "REIMPRESION_RECETA",
          affected_entity: "prescriptions",
          id_affected_registry: prescriptionId,
          details: "Reimpresión de receta #" + String(prescriptionId),
        });
      }

      return res.status(200).json(prescription);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}