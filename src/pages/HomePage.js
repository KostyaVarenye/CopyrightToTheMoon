import React from "react";
import { FeaturedProducts, Hero, Services, Contact } from "../components";

// homepage with hero, featured products, services, contact info
const HomePage = () => {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <Services />
      <Contact />
    </main>
  );
};
export default HomePage;
