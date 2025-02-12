import { createRoot } from "react-dom/client";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import AuthProvider from "./authProvider/AuthProvider.jsx";
import Home from "./home/Home.jsx";
import Login from "./authPages/Login.jsx";
import Register from "./authPages/Register.jsx";
import AddCars from "./cars/AddCars.jsx";
import MyCars from "./cars/MyCars.jsx";
import UpdateCar from "./cars/UpdateCar.jsx";
import AvailableCars from "./cars/AvailableCars.jsx";
import CarDetails from "./cars/CarDetails.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import MyBookings from "./bookings/MyBookings.jsx";
import axios from "axios";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: async () => {
          try {
            const response = await axios.get(
              "https://ride-bd-server-side.vercel.app/cars",
              {
                withCredentials: true,
              }
            );
            return response.data;
          } catch (error) {
            throw new Error(
              error.response?.data?.message || "Failed to fetch cars"
            );
          }
        },
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/addCar",
        element: (
          <PrivateRoute>
            <AddCars />
          </PrivateRoute>
        ),
      },
      {
        path: "/myCars",
        element: (
          <PrivateRoute>
            <MyCars />
          </PrivateRoute>
        ),
      },
      {
        path: "/updateCar/:id",
        element: (
          <PrivateRoute>
            <UpdateCar />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://ride-bd-server-side.vercel.app/car/${params.id}`),
      },
      {
        path: "/availableCars",
        element: <AvailableCars />,
        loader: () => fetch("https://ride-bd-server-side.vercel.app/cars"),
      },
      {
        path: "/carDetails/:id",
        element: (
          <PrivateRoute>
            <CarDetails />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://ride-bd-server-side.vercel.app/car/${params.id}`),
      },
      {
        path: "/myBookings",
        element: (
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
