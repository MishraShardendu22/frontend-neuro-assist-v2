import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const AutomatedCTReportAnalysis = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="border-border shadow-md">
        <div className="bg-primary h-2 w-full"></div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Automated CT Report Analysis</h2>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Processing scan results...</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-foreground font-medium">Hemorrhage Detection:</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                No Hemorrhage Detected
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-foreground font-medium">Infarct Detection:</p>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Acute Infarct in Left MCA
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-foreground font-medium">Vessel Occlusion:</p>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Large Vessel Occlusion in Left MCA
              </Badge>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex justify-center">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
              Manual Confirmation or Override
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between p-6 pt-0">
          <Button variant="ghost" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AutomatedCTReportAnalysis;