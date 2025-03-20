/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";
import { CardContent } from "@/components/ui/card";
import { PatientStore } from "@/store/patient.store";
import { PatientDetailsType } from "@/Types/Patient.types";
import TabsNavigation from "./componenet/tabs";
import PatientDetailsForm from "./componenet/patientdetails";
import VitalSignsForm from "./componenet/vital";
import ExclusionForm from "./componenet/ExclusionForm";
import SymptomsForm from "./componenet/symptoms";

const Survey = () => {
  const navigate = useNavigate();
  const { setPatient } = PatientStore();
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
    exclusionList: {
      anticoagulantMedicationsLast48Hours: {
        pradaxa: false,
        xarelto: false,
        coumadin: false,
        apixaban: false,
        edoxaban: false,
        therapeuticLovenox: false,
      },
      historyIntracranialHemorrhage: false,
      gastrointestinalBleedLast21Days: false,
      intracranialIntraspinalSurgeryLast3Months: false,
    }
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

  const handleExclusionCheckboxChange = (key: string, checked: boolean) => {
    setPatientDetails((prevDetails: any) => {
      if (key.includes(".")) {
        const [parentKey, childKey] = key.split(".");
        return {
          ...prevDetails,
          exclusionList: {
            ...prevDetails.exclusionList,
            [parentKey]: {
              ...prevDetails.exclusionList[parentKey],
              [childKey]: checked,
            },
          },
        };
      } else {
        return {
          ...prevDetails,
          exclusionList: {
            ...prevDetails.exclusionList,
            [key]: checked,
          },
        };
      }
    });
  };

const handleSubmit = async () => {
  try {
    console.log("Submitting patient details:", patientDetails);
    const res = await axiosInstance.post("/patient/register", patientDetails);

    if (res.status === 200) {
      toast.success("Patient Details Registered Successfully");
      setPatient(patientDetails);

      const lastKnownNormalDate = new Date(patientDetails.patientLastKnownNormal);
      if (isNaN(lastKnownNormalDate.getTime())) {
        toast.error("Invalid date format for last known normal time.");
        return;
      }

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      if (!(
        patientDetails.exclusionList.anticoagulantMedicationsLast48Hours.pradaxa ||
        patientDetails.exclusionList.anticoagulantMedicationsLast48Hours.xarelto ||
        patientDetails.exclusionList.anticoagulantMedicationsLast48Hours.apixaban ||
        patientDetails.exclusionList.anticoagulantMedicationsLast48Hours.coumadin ||
        patientDetails.exclusionList.anticoagulantMedicationsLast48Hours.edoxaban ||
        patientDetails.exclusionList.anticoagulantMedicationsLast48Hours.therapeuticLovenox ||
        patientDetails.exclusionList.gastrointestinalBleedLast21Days || 
        patientDetails.exclusionList.historyIntracranialHemorrhage || 
        patientDetails.exclusionList.intracranialIntraspinalSurgeryLast3Months
      )) {
        navigate("/patient/NoStroke");
        return;
      }

      if (lastKnownNormalDate < twentyFourHoursAgo) {
        navigate("/patient/generalAssessment");
      } else {
        if (!Object.values(patientDetails.symptoms).includes(true)) {
          navigate("/patient/thrombectomy");
        } else {
          navigate("/patient/thrombolysis");
        }
      }
    }
  } catch (error) {
    toast.error("Error registering patient details");
    console.error("Submission error:", error);
  }
};


  useEffect(() => {
    console.log("Updated patient details:", patientDetails);
  }, [patientDetails]);

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
            <PatientDetailsForm
              patientDetails={patientDetails}
              handleChange={handleChange}
              nextTab={() => setActiveTab("vitals")}
            />
          )}
          {activeTab === "vitals" && (
            <VitalSignsForm
              patientDetails={patientDetails}
              handleVitalSignsChange={handleVitalSignsChange}
              nextTab={() => setActiveTab("exclusion")}
              prevTab={() => setActiveTab("personal")}
            />
          )}
          {activeTab === "exclusion" && (
            <ExclusionForm
              patientDetails={patientDetails}
              handleCheckboxChange={handleExclusionCheckboxChange}
              nextTab={() => setActiveTab("symptoms")}
              prevTab={() => setActiveTab("vitals")}
            />
          )}
          {activeTab === "symptoms" && (
            <SymptomsForm
              patientDetails={patientDetails}
              handleCheckboxChange={handleCheckboxChange}
              prevTab={() => setActiveTab("exclusion")}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default Survey;