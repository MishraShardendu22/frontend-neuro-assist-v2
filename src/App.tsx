import Layout from "./Layout";
import Theme from "./store/ThemeStore";
import Home from "./components/Pages/Home/Home";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/Pages/Not-Found";
import Survey from "./components/Pages/Hospital/Survey/Survey";
import Thrombolysis from "./components/Pages/Hospital/Survey/Assesment/Treatment/Thrombolysis";
import Thrombectomy from "./components/Pages/Hospital/Survey/Assesment/Treatment/Thrombectomy";
import { GeneralAssesment } from "./components/Pages/Hospital/Survey/Assesment/general.assesment";
import AutomatedCTReportAnalysis from "./components/Pages/Hospital/Survey/Assesment/Analysis";
import AnalyseReport from "./components/Pages/Hospital/Survey/Assesment/AnalyseReport";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient/survey" element={<Survey />} />
        <Route path="/patient/thrombectomy" element={<Thrombectomy />} />
        <Route path="/patient/thrombolysis" element={<Thrombolysis />} />
        <Route path="/patient/sendAnalysis" element={<AnalyseReport />} />
        <Route path="/patient/generalAssessment" element={<GeneralAssesment />} />
        <Route path="/patient/allReports" element={<AutomatedCTReportAnalysis />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Theme />
    </Layout>
  );
};

export default App;
