/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import toast from "react-hot-toast";
import { PickerOverlay } from "filestack-react";
import axiosInstance from "@/lib/axiosInstance";
import { PatientStore } from "@/store/patient.store";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Alert, 
  AlertDescription 
} from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  X, 
  AlertTriangle, 
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Thrombectomy = () => {
  const patient = PatientStore((state) => state.patient);
  const patientEmail = patient?.patientEmail;
  
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [isPickerOverlayVisible, setIsPickerOverlayVisible] = useState(false);

  const navigate = useNavigate();

  const options = {
    accept: [
      ".pdf", ".doc", ".csv", ".ppt", ".txt", ".xls", ".pptx", ".docx", 
      ".xlsx", "image/*", "video/*", "image/png", "image/jpeg"
    ],
    fromSources: ["url", "camera", "local_file_system"],
    transformations: { crop: true, circle: true, rotate: true },
    maxFiles: 5,
    storeTo: { location: "s3" },
  };

  const sendDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Sending document", documentUrl, documentName);
    console.log("Patient email", patientEmail);

    if (!patientEmail || !documentUrl || !documentName) {
      toast.error("Missing required fields: Patient email, document name, or document URL.");
      return;
    }

    try {
      await axiosInstance.put("/patient/sendDocument", {
        email: patientEmail,
        documentName,
        documentUrl,
      });

      setDocumentUrl("");
      toast.success("Document sent successfully");
      setDocumentName("");

      navigate("/patient/sendAnalysis")
    } catch (error) {
      console.error(error);
      toast.error("Failed to send document");
    }
  };

  const onSuccess = (result: any) => {
    if (result.filesUploaded.length > 0) {
      setDocumentUrl(result.filesUploaded[0].url);
      setDocumentName(result.filesUploaded[0].filename || "Uploaded File");
      toast.success("File uploaded successfully");
      setIsPickerOverlayVisible(false);
    }
  };

  const onError = (error: any) => {
    console.error("Upload error:", error);
    toast.error("File upload failed");
    setIsPickerOverlayVisible(false);
  };

  const openFilePicker = () => {
    setIsPickerOverlayVisible(true);
  };

  return (
    <Card className="max-w-3xl mx-auto border-t-4 border-t-primary shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-primary flex items-center gap-2">
          <File className="h-6 w-6" />
          Thrombectomy Document Upload
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!patientEmail && (
          <Alert variant="destructive" className="border border-destructive/20 bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription className="ml-2 text-destructive-foreground">
              No patient selected. Please select a patient before uploading documents.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label htmlFor="documentName" className="text-sm font-medium text-foreground mb-1 block">
                Document Name
              </label>
              <Input
                id="documentName"
                placeholder="Enter document name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="bg-input text-foreground border-input focus:ring-ring focus:border-ring"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={openFilePicker}
              className="flex items-center gap-2 h-10 whitespace-nowrap border-input text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
          
          {documentUrl && (
            <div className="flex items-center p-3 bg-accent/20 border border-accent/50 rounded-md">
              <Badge className="bg-accent text-accent-foreground hover:bg-accent/80 mr-2 py-1">
                File
              </Badge>
              <span className="text-sm text-foreground flex-1 truncate">{documentName}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {setDocumentUrl(""); setDocumentName("");}}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 rounded-full p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end border-t border-border pt-4">
        <form onSubmit={sendDocument} className="w-full">
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              disabled={!documentUrl || !documentName}
            >
              <Send className="h-4 w-4" />
              Send Document
            </Button>
          </div>
        </form>
      </CardFooter>
      
      {isPickerOverlayVisible && (
        <PickerOverlay
          apikey={import.meta.env.VITE_FILESTACK_API_KEY as string}
          onError={onError}
          onSuccess={onSuccess}
          pickerOptions={options}
        />
      )}
    </Card>
  );
};

export default Thrombectomy;