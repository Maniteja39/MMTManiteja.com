import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { printDevConsoleMessage } from "./lib/devConsoleMessage";

printDevConsoleMessage();

createRoot(document.getElementById("root")!).render(<App />);
