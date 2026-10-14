import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";
import { ResumesPage } from "./pages/ResumesPage";
import { AnalyzePage } from "./pages/AnalyzePage";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { ApplicationDetailPage } from "./pages/ApplicationDetailPage";
import { AssistantPage } from "./pages/AssistantPage";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="main">
        <Routes>
          <Route path="/" element={<ResumesPage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
