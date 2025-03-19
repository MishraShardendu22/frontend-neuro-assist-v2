/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FileText, AlertCircle, Loader, Search } from "lucide-react";
import { PatientStore } from "@/store/patient.store";

interface Report {
  _id: string;
  documentUrl: string;
  documentName: string;
}

const AutomatedCTReportAnalysis = () => {
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const patient = PatientStore((state) => state.patient);
  const patientEmail = patient?.patientEmail;

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await axiosInstance.post("/patient/getAllPatientReports", {
          patientEmail,
        });

        const extractedReports = res.data.data[0].patientDocuments;
        console.log("extractedReports", extractedReports);

        setAllReports(extractedReports);
        setFilteredReports(extractedReports);
        toast.success("Reports loaded successfully!");
      } catch (error: any){
        console.error("There was an error:", error);
        setError(error?.message || "Failed to fetch reports");
        toast.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientEmail]);

  // Filter reports based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredReports(allReports);
    } else {
      const filtered = allReports.filter(report => 
        report.documentName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReports(filtered);
    }
  }, [searchQuery, allReports]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">CT Report Analysis</h1>
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-md">
          <span className="text-gray-600 font-medium">Patient:</span>
          <span className="ml-2 text-blue-600">{patientEmail}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading patient reports...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Patient Reports</h2>
            <div className="text-sm text-gray-500">
              {filteredReports.length} of {allReports.length} reports
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Search reports by name..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.map((report: Report) => (
                <a 
                  key={report._id}
                  href={report.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg p-4 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">{report.documentName}</h3>
                      <p className="text-sm text-gray-500">View Report</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
              <p className="text-gray-600">
                {allReports.length > 0 
                  ? "No reports match your search query" 
                  : "No reports found for this patient"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutomatedCTReportAnalysis;