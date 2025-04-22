import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CreditProvider } from "./context/creditContext.tsx";

createRoot(document.getElementById("root")!).render(
  <CreditProvider>
    <App />
  </CreditProvider>
);
