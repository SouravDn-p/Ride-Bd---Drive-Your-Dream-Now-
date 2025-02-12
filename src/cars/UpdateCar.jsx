import Swal from "sweetalert2";
import { useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";

export default function UpdateCar() {
  const { user } = useContext(AuthContexts);
  const loadedCar = useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const carModel = form.carModel.value.trim() || loadedCar.carModel;
    const rentalPrice = form.rentalPrice.value
      ? parseFloat(form.rentalPrice.value)
      : loadedCar.rentalPrice;
    const availability = form.availability.checked;
    const location = form.location.value.trim() || loadedCar.location;
    const description = form.description.value.trim() || loadedCar.description;
    const features = form.features.value
      ? form.features.value.split(",").map((f) => f.trim())
      : loadedCar.features;

    const updatedCar = {
      carModel,
      rentalPrice,
      availability,
      location,
      description,
      features,
      userEmail: user?.email,
      userName: user?.displayName,
    };

    fetch(`https://ride-bd-server-side.vercel.app/updateCar/${loadedCar._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCar),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Car Updated Successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/myCars");
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to Update Car",
            text: "Please try again.",
          });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        Swal.fire({
          icon: "error",
          title: "Error Updating Car",
          text: "Something went wrong. Please try again later.",
        });
      });
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-6 text-primary">
        Update Car
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
            defaultValue={loadedCar.carModel}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label font-medium text-gray-700">
            Rental Price
          </label>
          <input
            type="number"
            name="rentalPrice"
            defaultValue={loadedCar.rentalPrice}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label font-medium text-gray-700">
            Availability
          </label>
          <input
            type="checkbox"
            name="availability"
            defaultChecked={loadedCar.availability}
            className="checkbox checkbox-primary"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            defaultValue={loadedCar.location}
            className="input input-bordered w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            defaultValue={loadedCar.description}
            className="textarea textarea-bordered w-full"
            rows="4"
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <label className="label font-medium text-gray-700">Features</label>
          <input
            type="text"
            name="features"
            defaultValue={loadedCar.features.join(", ")}
            className="input input-bordered w-full"
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
            value={user?.displayName || "Test User"}
            disabled
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary w-full">
            Submit Update
          </button>
        </div>
      </form>
    </div>
  );
}
