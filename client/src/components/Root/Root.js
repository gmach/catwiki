
import React, { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { getBreeds } from "../../services";

export const RootContext = createContext()

export default function Root() {
  const [breeds, setBreeds] = useState({})

  useEffect(() => {
    (async () => { 
      const breeds = await getBreeds()
      setBreeds(breeds)
     })()
  }, [])

  return (
    <RootContext.Provider value={{ breeds, setBreeds }}>
      <Header />
      <Outlet/>
      <Footer />
    </RootContext.Provider>
  );
}