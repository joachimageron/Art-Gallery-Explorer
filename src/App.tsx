import { Route, Routes } from "react-router-dom";

import HomePage from "@/pages/home";
import IndexPage from "@/pages/index";

function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<IndexPage />} path="/test" />
    </Routes>
  );
}

export default App;
