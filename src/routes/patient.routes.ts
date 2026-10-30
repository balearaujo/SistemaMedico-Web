import { Router } from "express";
import { PatientController } from "../controllers/patient.controllers.ts";

const patientController = new PatientController();

export class PatientRoutes {
    static get router(): Router{
        const router =  Router();

        router.get('/search', patientController.searchPatients);
        router.post('/', patientController.createPatient);

        return router;
    }
}