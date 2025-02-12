import { useEffect, useState, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContexts } from "../authProvider/AuthProvider";

const CarDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContexts);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`https://ride-bd-server-side.vercel.app/car/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching car data:", err);
        setLoading(false);
      });
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      alert("Please log in to book the car.");
      return;
    }

    setShowModal(true);
  };

  const calculateTotalPrice = (startDate, endDate, dailyPrice) => {
    console.log(startDate, endDate, dailyPrice);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * dailyPrice : 0;
  };

  const handleConfirmBooking = async () => {
    if (!car) return;

    const { value: dates } = await Swal.fire({
      title: "Select Booking Dates",
      html: `
        <label for="startDate" style="display: block; margin-bottom: 5px;">Start Date</label>
        <input id="startDate" type="date" class="swal2-input" style="width: 80%; margin: auto;" min="${
          new Date().toISOString().split("T")[0]
        }" />
        <label for="endDate" style="display: block; margin-top: 15px; margin-bottom: 5px;">End Date</label>
        <input id="endDate" type="date" class="swal2-input" style="width: 80%; margin: auto;" min="${
          new Date().toISOString().split("T")[0]
        }" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        if (!startDate || !endDate) {
          Swal.showValidationMessage("Both dates are required.");
        } else if (new Date(startDate) > new Date(endDate)) {
          Swal.showValidationMessage("Start date must be before end date.");
        } else {
          return { startDate, endDate };
        }
      },
    });

    if (dates) {
      const totalPrice = calculateTotalPrice(
        dates.startDate,
        dates.endDate,
        car.rentalPrice
      );

      const bookingDetails = {
        carId: car._id,
        carModel: car.carModel,
        rentalPrice: car.rentalPrice,
        availability: car.availability,
        registrationNumber: car.registrationNumber,
        features: car.features,
        description: car.description,
        location: car.location,
        imageUrl: car.imageUrl,
        userEmail: user.email,
        userName: user.displayName || "Anonymous",
        bookingCount: car.bookingCount || "0",
        dateAdded: car.dateAdded,
        startDate: dates.startDate,
        endDate: dates.endDate,
        totalPrice: totalPrice,
        bookingStatus: "Pending",
      };

      fetch("https://ride-bd-server-side.vercel.app/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.insertedId) {
            Swal.fire(
              "Booking Confirmed!",
              "Your car booking is successful!",
              "success"
            );
            setShowModal(false);
          } else {
            Swal.fire("Booking Failed", "Please try again later.", "error");
          }
        })
        .catch((error) => console.error("Error booking the car:", error));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!car) {
    return <Navigate to="/404" />;
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-6 text-primary py-4">
        Car Details
      </h1>
      <div className="bg-base-200 container mx-auto w-10/12 py-10 rounded-lg">
        <div className="hero-content flex-col lg:flex-row items-start gap-10">
          <div className="lg:w-2/5 w-full">
            <img
              alt={car?.carModel || "Car Model"}
              src={car?.imageUrl || "https://via.placeholder.com/300x400"}
              className="rounded-xl shadow-xl w-full"
            />
          </div>

          <div className="lg:w-4/5 w-full">
            <h1 className="text-5xl font-extrabold mb-6 text-primary">
              {car?.carModel || "Unknown Car Model"}
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              {car?.description ||
                "No detailed description is available for this car."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xl">
                  <strong>Price per Day:</strong> ${car?.rentalPrice || "N/A"}
                </p>
                <p className="text-xl">
                  <strong>Availability:</strong>
                  {car?.availability ? "Available" : "Not Available"}
                </p>
                <p className="text-xl">
                  <strong>Features:</strong>
                  {car?.features?.join(", ") || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xl">
                  <strong>Location:</strong> {car?.location || "N/A"}
                </p>
                <p className="text-xl w-full">
                  <strong>registrationNumber: </strong>{" "}
                  {car?.registrationNumber || "Not Available"}
                </p>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="btn btn-primary px-8 text-lg font-semibold shadow-md hover:scale-105 transition-transform"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Confirm Your Booking
            </h2>
            <p className="text-xl mb-4 text-black">
              Are you sure you want to book the car:
              <strong>{car.carModel}</strong> for
              <strong>${car.rentalPrice}</strong> per day?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary text-lg px-6 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="btn btn-primary text-lg px-6 py-2"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarDetails;
