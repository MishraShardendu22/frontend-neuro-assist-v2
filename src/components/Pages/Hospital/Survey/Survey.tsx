/* eslint-disable @typescript-eslint/no-unused-vars */
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import TabsNavigation from "./componenet/tabs";
import { useNavigate } from "react-router-dom";
import VitalSignsForm from "./componenet/vital";
import axiosInstance from "@/lib/axiosInstance";
import SymptomsForm from "./componenet/symptoms";
import { CardContent } from "@/components/ui/card";
import { PatientStore } from "@/store/patient.store";
import { PatientDetailsType } from "@/Types/Patient.types";
import PatientDetailsForm from "./componenet/patientdetails";

const Survey = () => {
  const navigate = useNavigate();
  const { setPatient, patient } = PatientStore();
  const [activeTab, setActiveTab] = useState("personal");
  const [patientDetails, setPatientDetails] = useState<PatientDetailsType>({
    patientDOB: "",
    patientEmail: "",
    patientWeight: "",
    patientMedicalHistory: "",
    patientLastKnownNormal: "",
    vitalSigns: {
      BP: "",
      HeartRate: "",
      Temperature: "",
      OxygenSaturation: "",
    },
    symptoms: {
      Weakness: false,
      Numbness: false,
      FacialDroop: false,
      LossOfBalance: false,
      SpeechDifficulties: false,
      SuddenVisionChanges: false,
    },
  });

  const handleVitalSignsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientDetails((prevDetails) => ({
      ...prevDetails,
      vitalSigns: {
        ...prevDetails.vitalSigns,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleCheckboxChange = (symptom: string, checked: boolean) => {
    setPatientDetails((prevDetails) => ({
      ...prevDetails,
      symptoms: {
        ...prevDetails.symptoms,
        [symptom]: checked,
      },
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientDetails((prevDetails) => ({
      ...prevDetails,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting patient details:", patientDetails);
      const res = await axiosInstance.post("/patient/register", patientDetails);
      if (res.status === 200) {
        toast.success("Patient Details Registered Successfully");
        setPatient(patientDetails);
        // resetForm();
      }
      console.log(patient)
      if (patient) {
        const lastKnownNormalDate = new Date(patient.patientLastKnownNormal);
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        if (lastKnownNormalDate < twentyFourHoursAgo) {
          navigate("/patient/generalAssessment");
        } else {
          if(patient && !patient.symptoms.Weakness && !patient.symptoms.Numbness && !patient.symptoms.FacialDroop && !patient.symptoms.LossOfBalance && !patient.symptoms.SpeechDifficulties && !patient.symptoms.SuddenVisionChanges){
            navigate("/patient/thrombectomy");
          }else{
            navigate("/patient/thrombolysis");
          }
        }
      }
    } catch (error) {
      toast.error("Error registering patient details");
      console.error("Submission error:", error);
    }
  };

  const resetForm = () => {
    setPatientDetails({
      patientDOB: "",
      patientEmail: "",
      patientWeight: "",
      patientMedicalHistory: "",
      patientLastKnownNormal: "",
      vitalSigns: {
        BP: "",
        HeartRate: "",
        Temperature: "",
        OxygenSaturation: "",
      },
      symptoms: {
        Weakness: false,
        Numbness: false,
        FacialDroop: false,
        LossOfBalance: false,
        SpeechDifficulties: false,
        SuddenVisionChanges: false,
      },
    });
  };

  useEffect(() => {
    console.log("Updated Zustand Patient State:", patient);
  }, [patient]);

  return (
    <div className="min-h-screen bg-background py-8">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 mr-2 text-red-500" />
          <h1 className="text-2xl font-bold">Stroke Assessment Form</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Complete the following information to assess stroke risk and determine appropriate interventions.
        </p>

        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6">
          {activeTab === "personal" && (
            <PatientDetailsForm patientDetails={patientDetails} handleChange={handleChange} nextTab={() => setActiveTab("vitals")} />
          )}
          {activeTab === "vitals" && (
            <VitalSignsForm patientDetails={patientDetails} handleVitalSignsChange={handleVitalSignsChange} nextTab={() => setActiveTab("symptoms")} prevTab={() => setActiveTab("personal")} />
          )}
          {activeTab === "symptoms" && (
            <SymptomsForm patientDetails={patientDetails} handleCheckboxChange={handleCheckboxChange} prevTab={() => setActiveTab("vitals")} handleSubmit={handleSubmit} />
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default Survey;