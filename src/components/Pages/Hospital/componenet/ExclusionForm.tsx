import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface ExclusionFormProps {
  patientDetails: {
    exclusionList: {
      intracranialIntraspinalSurgeryLast3Months: boolean;
      gastrointestinalBleedLast21Days: boolean;
      historyIntracranialHemorrhage: boolean;
      anticoagulantMedicationsLast48Hours: Record<string, boolean>;
    };
  };
  handleCheckboxChange: (key: string, value: boolean) => void;
  nextTab: () => void;
  prevTab: () => void;
}

const ExclusionForm: React.FC<ExclusionFormProps> = ({
  patientDetails,
  handleCheckboxChange,
  nextTab,
  prevTab,
}) => {
  const allExclusionsEmpty =
    !patientDetails.exclusionList.intracranialIntraspinalSurgeryLast3Months &&
    !patientDetails.exclusionList.gastrointestinalBleedLast21Days &&
    !patientDetails.exclusionList.historyIntracranialHemorrhage &&
    Object.values(patientDetails.exclusionList.anticoagulantMedicationsLast48Hours).every(
      (value) => !value
    );

  return (
    <Card className="border-2 border-primary/20 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <CardTitle>Exclusion Criteria</CardTitle>
          </div>
          {allExclusionsEmpty && (
            <Badge variant="outline" className="bg-primary/5">
              No exclusions found
            </Badge>
          )}
        </div>
        <CardDescription>
          Review and check any applicable exclusion criteria
        </CardDescription>
        <Separator className="mt-2" />
      </CardHeader>

      <CardContent className="grid gap-5 pt-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="intracranialIntraspinalSurgeryLast3Months"
              checked={patientDetails.exclusionList.intracranialIntraspinalSurgeryLast3Months}
              onCheckedChange={(checked) =>
                handleCheckboxChange("intracranialIntraspinalSurgeryLast3Months", checked as boolean)
              }
            />
            <Label
              htmlFor="intracranialIntraspinalSurgeryLast3Months"
              className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Intracranial/Intraspinal Surgery in the Last 3 Months
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="gastrointestinalBleedLast21Days"
              checked={patientDetails.exclusionList.gastrointestinalBleedLast21Days}
              onCheckedChange={(checked) =>
                handleCheckboxChange("gastrointestinalBleedLast21Days", checked as boolean)
              }
            />
            <Label
              htmlFor="gastrointestinalBleedLast21Days"
              className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Gastrointestinal Bleed in the Last 21 Days
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="historyIntracranialHemorrhage"
              checked={patientDetails.exclusionList.historyIntracranialHemorrhage}
              onCheckedChange={(checked) =>
                handleCheckboxChange("historyIntracranialHemorrhage", checked as boolean)
              }
            />
            <Label
              htmlFor="historyIntracranialHemorrhage"
              className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              History of Intracranial Hemorrhage
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold">
            Anticoagulant Medications (Last 48 Hours)
          </h3>
          <Separator className="my-2" />
          <div className="space-y-3">
            {Object.entries(patientDetails.exclusionList.anticoagulantMedicationsLast48Hours).map(
              ([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`anticoagulant-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(`anticoagulantMedicationsLast48Hours.${key}`, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`anticoagulant-${key}`}
                    className="text-base font-normal capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Label>
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-4">
        <Button variant="outline" onClick={prevTab} className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={nextTab} className="flex items-center gap-1 bg-primary">
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExclusionForm;