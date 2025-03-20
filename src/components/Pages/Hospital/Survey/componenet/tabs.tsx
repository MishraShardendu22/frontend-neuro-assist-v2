import { cn } from "@/lib/utils";
import { AlertCircle, FormInputIcon, Heart, User } from "lucide-react";

interface TabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsNavigation = ({ activeTab, setActiveTab }: TabsNavigationProps) => {
  const tabs = [
    {
      id: "personal",
      label: "Patient Details",
      icon: <User className="h-5 w-5" />
    },
    {
      id: "vitals",
      label: "Vital Signs",
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: "exclusion",
      label: "Exclusion",
      icon: <FormInputIcon className="h-5 w-5" />
    },
    {
      id: "symptoms",
      label: "Symptoms",
      icon: <AlertCircle className="h-5 w-5" />
    },
  ];

  return (
    <div className="flex items-center justify-center my-6">
      <div className="bg-muted rounded-lg p-2 flex w-full max-w-lg shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 text-sm font-medium rounded-md py-3 px-4 transition-all",
              activeTab === tab.id 
                ? "bg-background text-foreground shadow-md scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span className="text-xs sm:text-sm font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsNavigation;