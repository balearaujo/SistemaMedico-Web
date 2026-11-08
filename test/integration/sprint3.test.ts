import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import sequelizeConnection from "../../src/conf/sequelize.connection.ts";
import { setupAssociations } from "../../src/models/associations.ts";
import Patient from "../../src/models/patient.models.ts";
import Medicine from "../../src/models/medicine.models.ts";
import Consultation from "../../src/models/consultation.models.ts";
import Prescription from "../../src/models/prescription.models.ts";
import PrescriptionDetail from "../../src/models/prescriptionDetail.models.ts";
import AuditLog from "../../src/models/auditLog.models.ts";

async function cleanTestData() {
  const testPatients = await Patient.findAll({
    where: { full_name: "TEST_Paciente_Sprint3" },
  });
  for (const p of testPatients as any[]) {
    const consultations = await Consultation.findAll({
      where: { id_patient: p.id_patient },
    });
    for (const c of consultations as any[]) {
      const prescs = await Prescription.findAll({
        where: { id_consultation: c.id_consultation },
      });
      for (const pr of prescs as any[]) {
        await PrescriptionDetail.destroy({
          where: { id_prescription: pr.id_prescription },
        });
        await AuditLog.destroy({
          where: {
            affected_entity: "prescriptions",
            id_affected_registry: pr.id_prescription,
          },
        });
      }
      await Prescription.destroy({
        where: { id_consultation: c.id_consultation, is_controlled: true },
      });
      await Prescription.destroy({
        where: { id_consultation: c.id_consultation, is_controlled: false },
      });
    }
    await Consultation.destroy({ where: { id_patient: p.id_patient } });
    await Patient.destroy({ where: { id_patient: p.id_patient } });
  }
}

describe("Pruebas de Integración Sprint 3 - Transacciones y Recetas", () => {
  before(async () => {
    setupAssociations();
    await sequelizeConnection.connect();
    await cleanTestData(); 
});

  after(async () => {
    await cleanTestData();
    await sequelizeConnection.disconnect();
  });

  test("Precarga exitosa de paciente subsecuente excluyendo signos vitales", async () => {
    const lastConsultation: any = await Consultation.findOne({
      where: { id_patient: 1 },
      attributes: ["id_consultation", "id_patient", "consultation_date", "diagnosis"],
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
      order: [
        ["consultation_date", "DESC"],
        ["id_consultation", "DESC"],
      ],
    });

    assert.ok(lastConsultation, "Debe existir al menos una consulta previa");
    assert.ok(lastConsultation.diagnosis.length > 0, "Debe traer el diagnóstico");
    assert.strictEqual(lastConsultation.blood_pressure, undefined);
    assert.strictEqual(lastConsultation.body_temperature, undefined);

    const totalMeds = lastConsultation.prescriptions.reduce(
      (acc: number, pr: any) => acc + (pr.details?.length || 0),
      0
    );
    assert.ok(totalMeds >= 2, "Debe precargar los medicamentos previos");
  });

  test("Emisión de receta mixta separando la controlada con id_origin_prescription", async () => {
    const sequelize = sequelizeConnection.getSequelize();
    const transaction = await sequelize.transaction();

    try {
      const uniqueSuffix = Date.now();
      const pacientePrueba: any = await Patient.create(
        {
          full_name: "TEST_Paciente_Sprint3",
          birthdate: "1995-10-10",
          contact: `449${String(uniqueSuffix).slice(-7)}`,
        },
        { transaction }
      );

      const consulta: any = await Consultation.create(
        {
          id_patient: pacientePrueba.id_patient,
          id_doctor: 1,
          diagnosis: "Cefalea tensional e insomnio severo",
          blood_pressure: "120/80",
        },
        { transaction }
      );

      const recetaGeneral: any = await Prescription.create(
        {
          id_consultation: consulta.id_consultation,
          id_origin_prescription: null,
          is_controlled: false,
          medical_snapshot: { doctor: "Dr. Alejandro Martínez Gómez" },
        },
        { transaction }
      );

      await PrescriptionDetail.create(
        {
          id_prescription: recetaGeneral.id_prescription,
          id_medication: 1,
          dose: "1 tableta",
          route_administration: "Oral",
          dosing_frequency: "Cada 8 hrs",
          duration: "3 días",
        },
        { transaction }
      );

      const recetaControlada: any = await Prescription.create(
        {
          id_consultation: consulta.id_consultation,
          id_origin_prescription: recetaGeneral.id_prescription,
          is_controlled: true,
          medical_snapshot: { doctor: "Dr. Alejandro Martínez Gómez" },
        },
        { transaction }
      );

      await PrescriptionDetail.create(
        {
          id_prescription: recetaControlada.id_prescription,
          id_medication: 5,
          dose: "Media tableta",
          route_administration: "Oral",
          dosing_frequency: "Cada 24 hrs",
          duration: "15 días",
        },
        { transaction }
      );

      await transaction.commit();

      assert.strictEqual(recetaGeneral.is_controlled, false);
      assert.strictEqual(recetaControlada.is_controlled, true);
      assert.strictEqual(
        recetaControlada.id_origin_prescription,
        recetaGeneral.id_prescription,
        "La receta controlada debe apuntar a la receta general"
      );
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  });

  test("Bitácora de Auditoría: Se registra el rastro en clinical_audit_logs", async () => {
    const ultimoLog: any = await AuditLog.findOne({
      where: { med_action: "CONSULTA_EXPEDIENTE" },
      order: [["created_at", "DESC"]],
    });

    assert.ok(ultimoLog, "Debe existir al menos un log de auditoría clínica");
    assert.strictEqual(ultimoLog.med_action, "CONSULTA_EXPEDIENTE");
  });
});