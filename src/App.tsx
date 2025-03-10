import Layout from "./Layout";
import Theme from "./store/ThemeStore";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/Pages/Not-Found";
import Survey from "./components/Pages/Hospital/Survey/Survey";
import { NormalAssesment } from "./components/Pages/Hospital/Assesment/normal.assesment";
import { GeneralAssesment } from "./components/Pages/Hospital/Assesment/general.assesment";
import Home from "./components/Pages/Home/Home";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient/survey" element={<Survey />} />
        <Route path="/patient/normalAssessment" element={<NormalAssesment />} />
        <Route path="/patient/generalAssessment" element={<GeneralAssesment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Theme />
    </Layout>
  );
};

export default App;
