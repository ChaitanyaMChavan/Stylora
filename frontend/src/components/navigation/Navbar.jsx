import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          <Link
            to="/"
            className="text-2xl font-bold"
          >
            Stylora
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link to="/">Home</Link>

            <Link to="/projects">
              Projects
            </Link>

            <Link to="/designers">
              Designers
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/contact">
              Contact
            </Link>
          </nav>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 border rounded-lg"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;