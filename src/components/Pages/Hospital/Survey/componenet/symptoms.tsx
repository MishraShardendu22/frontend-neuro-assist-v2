import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PatientDetailsType } from "@/Types/Patient.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SymptomsFormProps {
  prevTab: () => void;
  handleSubmit: () => void;
  patientDetails: PatientDetailsType;
  handleCheckboxChange: (symptom: string, checked: boolean) => void;
}

const SymptomsForm: React.FC<SymptomsFormProps> = ({ 
  patientDetails, 
  handleCheckboxChange, 
  prevTab, 
  handleSubmit 
}) => {
  const formatSymptomName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  const selectedSymptomsCount = Object.values(patientDetails.symptoms).filter(Boolean).length;
  const totalSymptoms = Object.keys(patientDetails.symptoms).length;
  
  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">Stroke Symptoms</CardTitle>
          <CardDescription>
            Please check all symptoms that the patient is experiencing
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-4">
            {Object.entries(patientDetails.symptoms).map(([symptom, isChecked]) => (
              <div 
                key={symptom} 
                className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50 transition-colors"
              >
                <Checkbox 
                  id={symptom} 
                  checked={isChecked as boolean} 
                  onCheckedChange={(checked) => handleCheckboxChange(symptom, checked === true)}
                  className="h-5 w-5 rounded-sm" 
                />
                <Label 
                  htmlFor={symptom} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {formatSymptomName(symptom)}
                </Label>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground flex items-center">
            <span className="mr-2">
              Selected: {selectedSymptomsCount} of {totalSymptoms}
            </span>
            {selectedSymptomsCount === 0 && (
              <span className="flex items-center text-amber-500 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 mr-1" />
                No symptoms selected
              </span>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevTab}
          className="px-4"
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          className="px-4 font-medium"
        >
          Submit Assessment
        </Button>
      </div>
    </>
  );
};

export default SymptomsForm;