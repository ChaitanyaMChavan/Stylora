import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Projects from "../pages/public/Projects";
import Designers from "../pages/public/Designers";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<PublicLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/designers"
            element={<Designers />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;