import { cn } from "@/lib/utils";
import { AlertCircle, Heart, User } from "lucide-react";

interface TabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsNavigation = ({ activeTab, setActiveTab }: TabsNavigationProps) => {
  const tabs = [
    {
      id: "personal",
      label: "Patient Details",
      icon: <User className="h-4 w-4" />
    },
    {
      id: "vitals",
      label: "Vital Signs",
      icon: <Heart className="h-4 w-4" />
    },
    {
      id: "symptoms",
      label: "Symptoms",
      icon: <AlertCircle className="h-4 w-4" />
    }
  ];

  return (
    <div className="flex items-center justify-center my-6">
      <div className="bg-muted rounded-lg p-1 flex w-full max-w-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex items-center justify-center gap-2 flex-1 text-sm font-medium rounded-md py-2 px-3 transition-all",
              activeTab === tab.id 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsNavigation;