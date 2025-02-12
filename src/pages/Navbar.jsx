import { useContext, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContexts);
  const location = useLocation();
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error("Sign-Out error:", err.message);
      });
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <div
      className="mx-2 md:mx-8 mt-4 rounded-lg"
      style={{ backgroundColor: "#9538E2" }}
    >
      <div
        className="navbar bg-base-100 rounded-lg"
        style={{ backgroundColor: "#9538E2", color: "white" }}
      >
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow md:hidden"
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
          <NavLink
            to="/"
            className="text-sm md:text-2xl font-bold text-primary ml-2"
            style={{ color: "white" }}
          >
            RIDE BD
          </NavLink>
        </div>

        <div className="hidden md:flex navbar-center gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-lg ${
                isActive ? "text-primary font-semibold" : "hover:text-primary"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/availableCars"
            className={({ isActive }) =>
              `text-lg ${
                isActive ? "text-primary font-semibold" : "hover:text-primary"
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
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
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
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
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
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`
                }
              >
                My Bookings
              </NavLink>
            </>
          )}
        </div>

        <div className="navbar-end">
          {!user ? (
            <div className="flex gap-4">
              <NavLink to="/login" className="btn btn-primary btn-sm">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-secondary btn-sm">
                Register
              </NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-4">
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
                  className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
