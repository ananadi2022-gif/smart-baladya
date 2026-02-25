import { createRoot } from "react-dom/client";
import App from "./App";
import { TranslationProvider } from "./hooks/use-translation";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <TranslationProvider>
    <App />
  </TranslationProvider>
);
