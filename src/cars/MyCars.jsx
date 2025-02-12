import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContexts } from "../authProvider/AuthProvider";

const MyCars = () => {
  const { user } = useContext(AuthContexts);
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSortChange = (sortType) => {
    setSortOption(sortType);
    const sortedCars = [...cars];
    if (sortType === "PriceAsc") {
      sortedCars.sort((a, b) => a.rentalPrice - b.rentalPrice);
    } else if (sortType === "YearAsc") {
      sortedCars.sort((a, b) => {
        const dateA = new Date(a.dateAdded).getTime();
        const dateB = new Date(b.dateAdded).getTime();
        return dateA - dateB;
      });
    }
    setCars(sortedCars);
  };

  useEffect(() => {
    if (user && user.email) {
      setLoading(true);

      axios
        .get(`https://ride-bd-server-side.vercel.app/myCars/${user.email}`, {
          withCredentials: true,
        })
        .then((response) => {
          setCars(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching cars:", error);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return (
      <div>
        <h2>Please log in to view your cars.</h2>
        <button onClick={() => navigate("/login")} className="btn btn-primary">
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        {/* Tailwind Spinner */}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-6 text-primary py-6">
        Your Cars
      </h1>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <div className="dropdown h-full">
          <label tabIndex={0} className="btn btn-secondary">
            Sort Options
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
          >
            <li>
              <button
                onClick={() => handleSortChange("PriceAsc")}
                className={`btn btn-ghost w-full text-left ${
                  sortOption === "PriceAsc" ? "bg-gray-200" : ""
                }`}
              >
                Pricing (Low to High)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSortChange("YearAsc")}
                className={`btn btn-ghost w-full text-left ${
                  sortOption === "YearAsc" ? "bg-gray-200" : ""
                }`}
              >
                Year (Old to New)
              </button>
            </li>
          </ul>
        </div>
      </div>
      {cars.length === 0 ? (
        <div>
          <p>No cars found.</p>
        </div>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full mt-5">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Car Model</th>
              <th className="border border-gray-300 p-2">Rental Price</th>
              <th className="border border-gray-300 p-2">Location</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id}>
                <td className="border border-gray-300 p-2">{car.carModel}</td>
                <td className="border border-gray-300 p-2">
                  ${car.rentalPrice}/day
                </td>
                <td className="border border-gray-300 p-2">{car.location}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => navigate(`/updateCar/${car._id}`)}
                    className="btn btn-warning mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "This action cannot be undone!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, delete it!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          fetch(
                            `https://ride-bd-server-side.vercel.app/car/${car._id}`,
                            {
                              method: "DELETE",
                            }
                          )
                            .then(() => {
                              setCars(cars.filter((c) => c._id !== car._id));
                              Swal.fire(
                                "Deleted!",
                                "Your car has been deleted.",
                                "success"
                              );
                            })
                            .catch((err) => console.error(err));
                        }
                      });
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyCars;
