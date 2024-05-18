import LoginPanel from "./components/Login/Login"
import { Routes, Route } from "react-router-dom";
import RegisterPanel from "./components/Register/Register";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<RegisterPanel />} />
    </Routes>
  );
}
export default App;
