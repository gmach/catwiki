import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function BreedCarousal({breeds, selectBreed}) {
  let [page, setPage] = useState(0);
  const handlePrev = e => {
    setPage(page => page - 1 < 0 ? 0 : page - 1)
  }
  const handleNext = e => {
    const maxPages = Math.floor(breeds.length / 4)
    setPage(page => page + 1 > maxPages ? maxPages : page + 1)
  }

  return (
    <>
      <div className="carousalWrap">
        <h2 className="title">{breeds.length} breeds for you to discover</h2>
        <div className='carousal'>
          <span className="arrow-left" onClick={handlePrev} />
          {
            breeds.length > 0 && 
              breeds.slice(page * 4, page * 4 + 4).map(breed => {
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
          <span className="arrow-right" onClick={handleNext} />
        </div>
      </div>
    </>
  )
}
