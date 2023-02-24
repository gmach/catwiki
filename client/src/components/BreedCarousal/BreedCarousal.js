import React from "react";
import { NavLink } from "react-router-dom";

export default function BreedCarousal({breeds, selectBreed}) {
  return (
    <>
      <div className="carousalWrap">
        <h2 className="title">{breeds.length} breeds for you to discover</h2>
        <div className='carousal'>
          {
            breeds.length > 0 && 
              breeds.slice(0, 4).map(breed => {
                return (
                  <NavLink 
                    key={breed.id} 
                    className="carousalImg"
                    to={`/breed/${breed.id}`}
                    onClick={()=>selectBreed(breed.id)}
                  >
                    <img src={breed.reference_image_url} alt={breed.name} />
                    <figcaption className="center">{breed.name}</figcaption>
                  </NavLink>
                )
              })
          }
        </div>
      </div>
    </>
  )
}
