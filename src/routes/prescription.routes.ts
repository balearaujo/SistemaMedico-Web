import { Router } from "express";
import { PrescriptionController } from "../controllers/prescription.controllers.ts";

const prescriptionController = new PrescriptionController();

export class PrescriptionRoutes{
    static get router(): Router{
        const router = Router();

        router.get(
            "/patient/:patientId/last", 
            prescriptionController.getLastPrescriptionByPatient
        );

        router.get(
            "/patient/:patientId/history",
            prescriptionController.getPatientPrescriptionHistory
        );

        router.get("/:id", prescriptionController.getPrescriptionById);

        router.post("/", prescriptionController.createPrescription);

        return router;
    }
}