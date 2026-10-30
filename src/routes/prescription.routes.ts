import { Router } from "express";
import { PrescriptionController } from "../controllers/prescription.controllers.ts";

const prescriptionController = new PrescriptionController();

export class PrescriptionRoutes{
    static get router(): Router{
        const router = Router();

        router.get('/patient/:patientId/last', prescriptionController.getLastPrescriptionByPatient);
        return router;
    }
}