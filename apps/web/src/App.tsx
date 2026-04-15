import { BrowserRouter, Route, Routes } from "react-router-dom";

import { SiteShell } from "./components/SiteShell";
import { CollectionPage } from "./pages/CollectionPage";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SiteShell activeNav="collections">
              <HomePage />
            </SiteShell>
          }
        />
        <Route
          path="/collections"
          element={
            <SiteShell activeNav="collections">
              <CollectionPage />
            </SiteShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
