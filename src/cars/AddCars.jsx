import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";

export default function AddCars() {
  const { user } = useContext(AuthContexts);
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const carModel = form.carModel.value;
    const rentalPrice = parseFloat(form.rentalPrice.value);
    const availability = form.availability.checked;
    const registrationNumber = form.registrationNumber.value;
    const features = form.features.value
      .split(",")
      .map((feature) => feature.trim());
    const description = form.description.value;
    const location = form.location.value;
    const imageUrl = form.imageUrl.value;
    const bookingCount = form.bookingCount.value;

    const newCar = {
      carModel,
      rentalPrice,
      availability,
      registrationNumber,
      features,
      description,
      location,
      imageUrl,
      userEmail: user.email,
      userName: user.displayName,
      bookingCount: 0 || bookingCount,
      dateAdded: new Date().toISOString(),
    };

    fetch("https://ride-bd-server-side.vercel.app/car", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCar),
    })
      .then((res) => res.json())
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Car Added Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        form.reset();
        navigate("/");
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-6 text-primary">
        Add New Car
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2">
          <label className="label font-medium text-gray-700">Car Model</label>
          <input
            type="text"
            name="carModel"
            placeholder="Enter the car model"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label font-medium text-gray-700">
            Daily Rental Price
          </label>
          <input
            type="number"
            name="rentalPrice"
            placeholder="Enter the daily rental price"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label font-medium text-gray-700">
            Availability
          </label>
          <input type="checkbox" name="availability" className="checkbox" />{" "}
          Available
        </div>

        <div className="md:col-span-2">
          <label className="label font-medium text-gray-700">
            Vehicle Registration Number
          </label>
          <input
            type="text"
            name="registrationNumber"
            placeholder="Enter the registration number"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="label font-medium text-gray-700">Features</label>
          <input
            type="text"
            name="features"
            placeholder="Enter features (e.g., GPS, AC, etc.), separated by commas"
            className="input input-bordered w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            placeholder="Write a detailed description of the car"
            className="textarea textarea-bordered w-full"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="label font-medium text-gray-700">
            Booking Count
          </label>
          <input
            type="number"
            name="bookingCount"
            placeholder="Enter booking count (default: 0)"
            className="input input-bordered w-full"
            defaultValue="0"
            min="0"
            required
          />
        </div>

        <div>
          <label className="label font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter the location"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            placeholder="Enter the image URL"
            className="input input-bordered w-full"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label font-medium text-gray-700">User Email</label>
          <input
            type="email"
            value={user?.email || "testuser@example.com"}
            disabled
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div>
          <label className="label font-medium text-gray-700">User Name</label>
          <input
            type="text"
            value={user?.displayName || "Anonymous"}
            disabled
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary w-full">
            Submit Car
          </button>
        </div>
      </form>
    </div>
  );
}
