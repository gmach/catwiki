import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from '../Root';
import Home from '../Home'
import BreedDetails from "../BreedDetails";
import ErrorPage from '../ErrorPage'
import './App.scss';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { 
            index: true, element: <Home />,
          },
          {
            path: "breed/:breedId",
            element: <BreedDetails />  
          }
        ]
      }     
    ]
  }

]);

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}