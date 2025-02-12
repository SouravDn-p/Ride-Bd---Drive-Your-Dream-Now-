import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContexts);
  const location = useLocation();
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert("Error signing out: " + err.message);
      });
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-primary shadow-lg">
      <div className="navbar bg-base-100 rounded-lg text-white px-4 py-2">
        <div className="navbar-start">
          <div className="dropdown">
            <button tabIndex={0} className="btn btn-ghost btn-circle md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="menu dropdown-content absolute top-12 left-0 w-48 bg-base-100 text-black shadow-md rounded-box"
            >
              <li>
                <NavLink to="/" className="hover:text-primary">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/availableCars" className="hover:text-primary">
                  Available Cars
                </NavLink>
              </li>
              {user && (
                <>
                  <li>
                    <NavLink to="/addCar" className="hover:text-primary">
                      Add Car
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/myCars" className="hover:text-primary">
                      My Car
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/myBookings" className="hover:text-primary">
                      My Bookings
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          <NavLink to="/">
            <img
              src="https://i.ibb.co.com/4Y25pb1/Ride-BD.jpg"
              alt="Ride BD Logo"
              className="h-12 ml-2 rounded-full"
            />
          </NavLink>
          <NavLink to="/" className="text-lg md:text-2xl font-bold ml-2">
            RIDE BD
          </NavLink>
        </div>

        <div className="hidden md:flex navbar-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-lg ${
                isActive
                  ? "font-bold text-blue-500 dark:text-yellow-400"
                  : "hover:text-gray-400"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/availableCars"
            className={({ isActive }) =>
              `text-lg ${
                isActive
                  ? "font-bold text-blue-500 dark:text-yellow-400"
                  : "hover:text-gray-400"
              }`
            }
          >
            Available Cars
          </NavLink>
          {user && (
            <>
              <NavLink
                to="/addCar"
                className={({ isActive }) =>
                  `text-lg ${
                    isActive
                      ? "font-bold text-blue-500 dark:text-yellow-400"
                      : "hover:text-gray-400"
                  }`
                }
              >
                Add Car
              </NavLink>
              <NavLink
                to="/myCars"
                className={({ isActive }) =>
                  `text-lg ${
                    isActive
                      ? "font-bold text-blue-500 dark:text-yellow-400"
                      : "hover:text-gray-400"
                  }`
                }
              >
                My Car
              </NavLink>
              <NavLink
                to="/myBookings"
                className={({ isActive }) =>
                  `text-lg ${
                    isActive
                      ? "font-bold text-blue-500 dark:text-yellow-400"
                      : "hover:text-gray-400"
                  }`
                }
              >
                My Bookings
              </NavLink>
            </>
          )}
        </div>

        <div className="navbar-end flex items-center gap-4">
          <button onClick={toggleTheme} className="btn btn-sm btn-outline">
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {!user ? (
            <div className="flex gap-3">
              <NavLink to="/login" className="btn btn-primary btn-sm">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-secondary btn-sm">
                Register
              </NavLink>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="cursor-pointer flex items-center gap-2"
              >
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={
                        user.photoURL ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                      alt="User"
                    />
                  </div>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 p-2 shadow bg-base-100 text-black rounded-box w-52"
              >
                <li className="font-semibold text-center">
                  {user.displayName || "User"}
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-error btn-sm btn-block"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
