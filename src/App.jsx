import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GitHubLanding from "./GitHubLanding";
import Dashboard from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GitHubLanding />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;