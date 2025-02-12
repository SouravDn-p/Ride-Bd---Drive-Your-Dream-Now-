import { useContext, useState } from "react";
import { Link, NavLink, useLoaderData } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";
import Lottie from "lottie-react";
import Ride from "../assets/Ride.json";
import { useTypewriter, Cursor } from "react-simple-typewriter";

const HomePage = () => {
  const { user } = useContext(AuthContexts);
  const [theme, setTheme] = useState("light");
  const loadedData = useLoaderData();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const themeStyles = {
    light: {
      backgroundColor: "#FFFFF0",
      color: "#000000",
    },
    dark: {
      backgroundColor: "#000000",
      color: "#FFFFF0",
    },
  };

  const [text] = useTypewriter({
    words: ["Now!", "Today!", "Tomorrow!", "Repeat!"],
    loop: true,
    typeSpeed: 70,
  });
  return (
    <div>
      <section>
        <div
          style={{
            backgroundColor: themeStyles[theme].color,
            color: themeStyles[theme].backgroundColor,
          }}
          className="text-white animate__animated animate__bounce rounded-lg  mt-4"
        >
          <div
            className="flex justify-center items-center bg-opacity-75 "
            style={{
              backgroundColor: themeStyles[theme].color,
              color: themeStyles[theme].backgroundColor,
            }}
          >
            <Lottie animationData={Ride} loop={true} />
            <h1
              className="animate__animated animate__headShake   text-4xl font-bold text-center"
              style={{
                backgroundColor: themeStyles[theme].color,
                color: themeStyles[theme].backgroundColor,
              }}
            >
              <div className="flex items-center justify-center">
                <button
                  className="btn btn-primary"
                  onClick={toggleTheme}
                  style={{
                    backgroundColor: themeStyles[theme].color,
                    color: themeStyles[theme].backgroundColor,
                  }}
                >
                  Toggle to {theme === "light" ? "Dark" : "Light"} Theme
                </button>
              </div>
              {user
                ? `Welcome to Your Profile ${user.displayName} `
                : "Login to enjoy Chill gamer Anonymous!"}
              <div >
                <h1
                  className="text-4xl font-bold text-center pt-4"
                  style={{ color: "green", fontWeight: "bold" }}
                >
                  Drive Your Dreams
                  <span className="text-red-500 "> {text}</span>
                  <span>
                    <Cursor cursorStyle="|" />
                  </span>
                </h1>
              </div>
              <NavLink to="/availableCars">
                <button className="px-6 mt-4 py-3 text-lg font-semibold bg-primary hover:bg-primary-dark text-white rounded-md shadow-lg">
                  View Available Cars
                </button>
              </NavLink>
            </h1>
          </div>
        </div>
      </section>

      <section className="highest-rated-games mt-10">
        <section className="highest-rated-games mt-10">
          <h2 className="text-3xl font-bold text-center mb-6">
            Highest Rated Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            {loadedData
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 6)
              .map((car) => (
                <div
                  key={car._id}
                  className="card bg-base-100 shadow-lg object-cover relative rounded-sm"
                  style={{
                    backgroundImage: `url(${car.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-80  border"></div>
                  <div className="card-body relative font-bold z-10 text-white text-bold">
                    <h2 className="card-title mx-auto font-bold">
                      {car.carModel}
                    </h2>
                    <p>{car.description}</p>
                    <p className="text-sm mb-2">
                      Rental Price:
                      <span className="text-primary">
                        ${car.rentalPrice}/day
                      </span>
                    </p>
                    <p className="text-sm mb-2">Location: {car.location}</p>
                    <p className="text-sm mb-2">
                      Features: {car.features.join(", ")}
                    </p>
                    <div className="card-actions justify-end">
                      <Link
                        to={`/review-details/${car._id}`}
                        className="btn btn-primary btn-block"
                      >
                        Explore Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </section>

      <section className="py-16  text- black">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl  font-bold mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🚗",
                title: "Wide Variety of Cars",
                description: "From budget-friendly options to luxury vehicles.",
              },
              {
                icon: "💸",
                title: "Affordable Prices",
                description: "Competitive daily rates you can count on.",
              },
              {
                icon: "🖱️",
                title: "Easy Booking Process",
                description: "Seamlessly book your ride in just a few clicks.",
              },
              {
                icon: "📞",
                title: "Customer Support",
                description: "24/7 assistance for all your queries.",
              },
            ].map((point, index) => (
              <div
                key={index}
                className="bg-[#F8FAFC] p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{point.icon}</div>
                <h3 className="text-xl text-black font-semibold mb-2">
                  {point.title}
                </h3>
                <p className="text-gray-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
