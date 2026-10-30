import type { Request, Response } from "express";;
import { Op, Sequelize } from "sequelize";
import Patient from "../models/patient.models.ts";

export class PatientController{
    constructor(){}

    public async createPatient(req: Request, res: Response){
        try{
            const{ full_name, birthdate, contact }= req.body;

            if (!full_name || !birthdate || !contact){
                return res.status(400).json({ message: "Full name, birthdate and contact are required"});
            }

            if(new Date(birthdate) > new Date()){
                return res.status(400).json({ message: "Birthdate cannot be later than today"});
            }

            const existingPatient = await Patient.findOne({
                where: { full_name, birthdate }
            });

            if(existingPatient){
                return res.status(409).json({ message: "A patient with the same name and birthdate already exists"});
            }

            const newPatient = await Patient.create({
                full_name,
                birthdate,
                contact: contact.trim()
            });
            return res.status(201).json(newPatient);
        }catch(error){
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor al registrar el paciente"});
        }
    }

    public async searchPatients(req: Request, res: Response){
        try{
            const query = req.query.q as string;

            const patients = await Patient.findAll({
                where: query ?{
                    full_name: { [Op.like]: `%${query}%` }
                }: {},
                attributes: [
                    'id_patient',
                    'full_name',
                    'birthdate',
                    'contact',
                    'opening_date',
                    [Sequelize.literal('TIMESTAMPDIFF(YEAR, birthdate, CURDATE())'), 'age']
                ],
                limit: 20,
            });
            return res.status(200).json(patients);
        }catch(error){
            console.error(error);
            return res.status(500).json({ message: "Internal server error."});
        }
    }
}