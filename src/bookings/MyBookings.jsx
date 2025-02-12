import { useContext, useEffect, useState } from "react";
import { AuthContexts } from "../authProvider/AuthProvider";
import Swal from "sweetalert2";
import RentalPriceChart from "./RentalPriceChart";
import NotFound from "../pages/NotFound";

export default function MyBookings() {
  const { user } = useContext(AuthContexts);
  const [bookings, setBooking] = useState([]);

  const calculateTotalPrice = (startDate, endDate, dailyPrice) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * dailyPrice : 0;
  };

  const handleModifyDate = async (bookingId) => {
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
      const booking = bookings.find((b) => b._id === bookingId);
      const totalPrice = calculateTotalPrice(
        dates.startDate,
        dates.endDate,
        booking.rentalPrice
      );

      const updateBooking = {
        startDate: dates.startDate,
        endDate: dates.endDate,
        totalPrice,
        userEmail: user?.email,
        userName: user?.displayName,
      };

      try {
        const response = await fetch(
          `https://ride-bd-server-side.vercel.app/updateBookings/${bookingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateBooking),
          }
        );
        const result = await response.json();
        if (response.ok) {
          Swal.fire(
            "Success",
            "Booking dates updated successfully!",
            "success"
          );
          setBooking(
            bookings.map((b) =>
              b._id === bookingId ? { ...b, ...dates, totalPrice } : b
            )
          );
        } else {
          Swal.fire(
            "Error",
            result.message || "Failed to update the booking dates.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error updating booking:", error);
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  const handleCancelBooking = (bookingId) => {
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
        fetch(`https://ride-bd-server-side.vercel.app/bookings/${bookingId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to delete booking.");
            }
            setBooking(bookings.filter((b) => b._id !== bookingId));
            Swal.fire("Deleted!", "Your booking has been deleted.", "success");
          })
          .catch((err) => console.error(err));
      }
    });
  };

  useEffect(() => {
    if (user && user.email) {
      fetch(`https://ride-bd-server-side.vercel.app/myBookings/${user.email}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch bookings.");
          }
          return res.json();
        })
        .then((data) => {
          setBooking(data);
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }
  }, [user]);

  return (
    <div className="container mx-auto mt-10 p-4 sm:p-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 text-primary">
        Your Car Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center">
          <p className="text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 py-4 px-6 rounded-lg shadow-lg">
            No bookings found.
          </p>
          <NotFound />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-base-200 rounded-lg text-sm sm:text-base">
            <thead>
              <tr className="text-left">
                <th className="p-2 sm:p-4">Car Image</th>
                <th className="p-2 sm:p-4">Car Model</th>
                <th className="p-2 sm:p-4 text-center">Start Date</th>
                <th className="p-2 sm:p-4 text-center">End Date</th>
                <th className="p-2 sm:p-4">Total Price</th>
                <th className="p-2 sm:p-4 text-center">Status</th>
                <th className="p-2 sm:p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="p-2 sm:p-4">
                    <img
                      alt={booking.carModel || "Car Image"}
                      src={
                        booking.imageUrl || "https://via.placeholder.com/150"
                      }
                      className="rounded-xl shadow-xl w-24 h-24 sm:w-32 sm:h-32 mx-auto"
                    />
                  </td>
                  <td className="p-2 sm:p-4 font-bold line-clamp-2">
                    {booking.carModel || "Unknown Car Model"}
                  </td>
                  <td className="p-2 sm:p-4 text-center">
                    {booking.startDate}
                  </td>
                  <td className="p-2 sm:p-4 text-center">{booking.endDate}</td>
                  <td className="p-2 sm:p-4">${booking.totalPrice || "N/A"}</td>
                  <td className="p-2 sm:p-4 text-center">
                    <span
                      className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full ${
                        booking.bookingStatus === "Pending"
                          ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="p-2 sm:p-4">
                    <button
                      onClick={() => handleModifyDate(booking._id)}
                      className="bg-blue-500 text-white py-1 px-2 sm:py-1 sm:px-4 rounded-full mr-2"
                    >
                      Modify Date
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="bg-red-500 text-white py-1 px-2 sm:py-1 sm:px-4 rounded-full"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RentalPriceChart />
    </div>
  );
}
