interface Symptoms {
  Weakness: boolean;
  Numbness: boolean;
  FacialDroop: boolean;
  SpeechDifficulties: boolean;
  SuddenVisionChanges: boolean;
  LossOfBalance: boolean;
}

interface VitalSigns {
  Temperature: string;
  BP: string;
  OxygenSaturation: string;
  HeartRate: string;
}

interface PatientDetailsType {
  patientEmail: string;
  patientDOB: string;
  patientWeight: string;
  patientLastKnownNormal: string;
  patientMedicalHistory: string;
  vitalSigns: VitalSigns;
  symptoms: Symptoms;
}


export type {
    Symptoms,
    VitalSigns,
    PatientDetailsType,
}