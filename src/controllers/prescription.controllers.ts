import type { Request, Response } from "express";
import Prescription from "../models/prescription.models.ts";

export class PrescriptionController{
    contructor(){}

    public async getLastPrescriptionByPatient(req: Request, res: Response){
        try{
            const patientId = Number(req.params.patientId);

            const lastPrescription = await Prescription.findOne({
                where:{/*Se puede filtrar o ordenar por fecha de emisión */},
                order: [['issue_date', 'DESC']] 
            });

            if (!lastPrescription){
                return res.status(200).json({message: "No previous prescriptions found for this patient (First time patient)" });
            }
            return res.status(200).json(lastPrescription);
        }catch(error){
            console.error(error);
            return res.status(500).json({ message: "Internal server error"});
        }
    }
}