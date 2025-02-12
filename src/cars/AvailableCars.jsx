import { useLoaderData, Link } from "react-router-dom";
import { useState } from "react";

const AvailableCars = () => {
  const loadedData = useLoaderData();
  const [cars, setCars] = useState(loadedData);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("");

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCars(
      loadedData.filter(
        (car) =>
          car.carModel.toLowerCase().includes(query) ||
          car.location.toLowerCase().includes(query)
      )
    );
  };

  const handleSortChange = (sortType) => {
    setSortOption(sortType);
    const sortedCars = [...cars];
    if (sortType === "NewestFirst") {
      sortedCars.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (sortType === "OldestFirst") {
      sortedCars.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    } else if (sortType === "PriceAsc") {
      sortedCars.sort((a, b) => a.rentalPrice - b.rentalPrice);
    } else if (sortType === "PriceDesc") {
      sortedCars.sort((a, b) => b.rentalPrice - a.rentalPrice);
    }

    setCars(sortedCars);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  return (
    <div className="container mx-auto mt-10 px-4 lg:px-0">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Available Cars
      </h1>

      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by model or location..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="input input-bordered w-full lg:w-1/3 mb-4 lg:mb-0"
        />

        <div className="dropdown">
          <label tabIndex={0} className="btn btn-secondary">
            Sort Options
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
          >
            <li>
              <button
                onClick={() => handleSortChange("NewestFirst")}
                className="btn btn-ghost w-full text-left"
              >
                Date Added: Newest First
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSortChange("OldestFirst")}
                className="btn btn-ghost w-full text-left"
              >
                Date Added: Oldest First
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSortChange("PriceAsc")}
                className="btn btn-ghost w-full text-left"
              >
                Price: Low to High
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSortChange("PriceDesc")}
                className="btn btn-ghost w-full text-left"
              >
                Price: High to Low
              </button>
            </li>
          </ul>
        </div>

        {/* View Toggle */}
        <button onClick={toggleViewMode} className="btn btn-primary lg:ml-4">
          Toggle {viewMode === "grid" ? "List View" : "Grid View"}
        </button>
      </div>

      {cars.length === 0 ? (
        <p className="text-center text-white text-lg">No cars found.</p>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car._id}
              className="card bg-base-100 shadow-lg border rounded-lg overflow-hidden"
            >
              <figure className="relative">
                <img
                  src={car.imageUrl}
                  alt={car.carModel}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent w-full h-full opacity-70"></div>
              </figure>
              <div className="card-body p-6">
                <h2 className="card-title text-xl font-semibold mx-auto text-white mb-2">
                  {car.carModel}
                </h2>
                <p className="text-sm text-white text-left mb-1">
                  <strong>Location:</strong> {car.location}
                </p>
                <p className="text-sm text-white text-left mb-1">
                  <strong>Price:</strong> ${car.rentalPrice}
                </p>
                <p className="text-sm text-white text-left mb-1">
                  <strong>Booking Count:</strong> {car.bookingCount} bookings
                </p>
                <p className="text-sm text-white text-left mb-3 line-clamp-2">
                  <strong>Description:</strong> {car.description}
                </p>
                <p className="text-sm text-white text-left mb-1">
                  <strong>Date Added:</strong>{" "}
                  {new Date(car.dateAdded).toLocaleDateString()}
                </p>

                <div className="card-actions justify-end">
                  <Link
                    to={`/carDetails/${car._id}`}
                    className="btn btn-primary btn-block"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {cars.map((car) => (
            <div
              key={car._id}
              className="flex items-start space-x-4 bg-base-100 shadow-md p-4 rounded-lg"
            >
              <img
                src={car.imageUrl}
                alt={car.carModel}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {car.carModel}
                </h2>
                <p className="text-sm text-white">
                  <strong>Location:</strong> {car.location}
                </p>
                <p className="text-sm text-white">
                  <strong>Price:</strong> ${car.rentalPrice}
                </p>
                <p className="text-sm text-white">
                  <strong>Booking Count:</strong> {car.bookingCount} bookings
                </p>
                <p className="text-sm text-white">
                  <strong>Date Added:</strong>{" "}
                  {new Date(car.dateAdded).toLocaleDateString()}
                </p>
                <Link
                  to={`/carDetails/${car._id}`}
                  className="text-primary underline"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableCars;
