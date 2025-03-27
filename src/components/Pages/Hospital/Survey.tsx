/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TabsNavigation from "./componenet/tabs";
import VitalSignsForm from "./componenet/vital";
import axiosInstance from "@/lib/axiosInstance";
import SymptomsForm from "./componenet/symptoms";
import UploadComponent from "./componenet/Upload";
import { CardContent } from "@/components/ui/card";
import { PatientStore } from "@/store/patient.store";
import ExclusionForm from "./componenet/ExclusionForm";
import { PatientDetailsType } from "@/Types/Patient.types";
import PatientDetailsForm from "./componenet/patientdetails";
import Report from "./componenet/report";

const Survey = () => {
  const navigate = useNavigate();
  const { setPatient } = PatientStore();
  const [activeTab, setActiveTab] = useState("personal");
  const [patientDetails, setPatientDetails] = useState<PatientDetailsType>({
    patientDOB: "1972-05-14",
    patientEmail: "janedoe@example.com",
    patientWeight: "68",
    patientMedicalHistory: "Hypertension, High Cholesterol",
    patientLastKnownNormal: "",
    vitalSigns: {
      BP: "135/85",
      HeartRate: "78",
      Temperature: "36.5",
      OxygenSaturation: "96",
    },
    symptoms: {
      Weakness: true,
      Numbness: true,
      FacialDroop: false,
      LossOfBalance: true,
      SpeechDifficulties: true,
      SuddenVisionChanges: false,
    },
    exclusionList: {
      anticoagulantMedicationsLast48Hours: {
        pradaxa: false,
        xarelto: true,
        coumadin: false,
        apixaban: false,
        edoxaban: false,
        therapeuticLovenox: false,
      },
      historyIntracranialHemorrhage: false,
      gastrointestinalBleedLast21Days: false,
      intracranialIntraspinalSurgeryLast3Months: false,
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

        const lastKnownNormalDate = new Date(
          patientDetails.patientLastKnownNormal
        );
        if (isNaN(lastKnownNormalDate.getTime())) {
          toast.error("Invalid date format for last known normal time.");
          return;
        }

        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        if (
          !(
            patientDetails.exclusionList.anticoagulantMedicationsLast48Hours
              .pradaxa ||
            patientDetails.exclusionList.anticoagulantMedicationsLast48Hours
              .xarelto ||
            patientDetails.exclusionList.anticoagulantMedicationsLast48Hours
              .apixaban ||
            patientDetails.exclusionList.anticoagulantMedicationsLast48Hours
              .coumadin ||
            patientDetails.exclusionList.anticoagulantMedicationsLast48Hours
              .edoxaban ||
            patientDetails.exclusionList.anticoagulantMedicationsLast48Hours
              .therapeuticLovenox ||
            patientDetails.exclusionList.gastrointestinalBleedLast21Days ||
            patientDetails.exclusionList.historyIntracranialHemorrhage ||
            patientDetails.exclusionList
              .intracranialIntraspinalSurgeryLast3Months
          )
        ) {
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
    <div className="min-h-screen bg-background py-8 flex justify-center">
      <CardContent className="p-6 w-full max-w-6xl">
        {" "}
        {/* Increased to max-w-6xl */}
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 mr-2 text-red-500" />
          <h1 className="text-2xl font-bold">Stroke Assessment Form</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Complete the following information to assess stroke risk and determine
          appropriate interventions.
        </p>
        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6">
          {/* 1.) Personal Details is the 1st Tab */}
          {activeTab === "personal" && (
            <PatientDetailsForm
              patientDetails={patientDetails}
              handleChange={handleChange}
              nextTab={() => setActiveTab("vitals")}
            />
          )}
          {/* 2.) Vitals is 2nd Tab */}
          {activeTab === "vitals" && (
            <VitalSignsForm
              patientDetails={patientDetails}
              handleVitalSignsChange={handleVitalSignsChange}
              nextTab={() => setActiveTab("symptoms")}
              prevTab={() => setActiveTab("personal")}
            />
          )}
          {/* 3.) Symptoms is 3rd Tab */}
          {activeTab === "symptoms" && (
            <SymptomsForm
              patientDetails={patientDetails}
              handleCheckboxChange={handleCheckboxChange}
              nextTab={() => setActiveTab("exclusion")}
              prevTab={() => setActiveTab("vitals")}
            />
          )}
          {/* 4.) Exclusion is 4th Tab */}
          {activeTab === "exclusion" && (
            <ExclusionForm
              patientDetails={patientDetails}
              handleCheckboxChange={handleExclusionCheckboxChange}
              nextTab={() => setActiveTab("upload")}
              prevTab={() => setActiveTab("symptoms")}
            />
          )}
          {/* 5.) Upload Page is the 5th Tab */}
          {activeTab === "upload" && (
            <UploadComponent
              nextTab={() => setActiveTab("reports")}
              prevTab={() => setActiveTab("exclusion")}
            />
          )}
          {/* 6.) Report is 6th Tab */}
          {activeTab === "reports" && (
            <Report prevTab={() => setActiveTab("upload")} />
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default Survey;
