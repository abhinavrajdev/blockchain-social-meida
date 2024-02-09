import AuthorProfile from "./pages/AuthorProfile";
import Authors from "./pages/Authors";
import Landingpage from "./pages/Landingpage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostPreview from "./pages/PostPreview";
import CreateAccount from "./pages/CreateAccount";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/news/:filter" element={<PostPreview />} />
        <Route path="/news" element={<Landingpage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/author/:filter" element={<AuthorProfile />} />
        <Route path="/author" element={<Authors />} />
        <Route path="/claimAccount" element={<CreateAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
