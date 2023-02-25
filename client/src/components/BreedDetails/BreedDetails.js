import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BreedImages from "../BreedImages";
import { getBreeds } from "../../services";
import BreedDetailsHeroImage from "../BreedDetailsHeroImage/BreedDetailsHeroImage";

export default function BreedDetails () {
  const [breed, setBreed] = useState()
  const location = useLocation()
  useEffect(() => {
    (async () => { 
      const breedId = location.pathname.substring('/breed/'.length)
      const breeds = await getBreeds(breedId);
      setBreed(breeds[breedId])
     })()
  }, [location.pathname])
  if (!breed) 
    return null
    
  return (
    <>
      <main className="breedDetailsWrap">
        { breed && 
        <>
          <BreedDetailsHeroImage breedName={breed.name} breedId={breed.reference_image_id} />
          <section className="breedDetails">
            <h1>{breed.name}</h1>
            <h2>{breed.description}</h2>
            <table>
              <tbody>
                <tr>
                  <th>Temperament</th>
                  <td>{breed.temperament}</td>
                </tr>
                <tr>
                  <th>Origin</th>
                  <td>{breed.origin}</td>
                </tr>
                <tr>
                  <th>Life Span</th>
                  <td>{breed.life_span}</td>
                </tr>
                <tr>
                  <th>Adaptability</th>
                  <td>{breed.adaptability}</td>
                </tr>
                <tr>
                  <th>Affection Level</th>
                  <td>{breed.affection_level}</td>
                </tr>
                <tr>
                  <th>Child Friendly</th>
                  <td>{breed.child_friendly}</td>
                </tr>
                <tr>
                  <th>Grooming</th>
                  <td>{breed.grooming}</td>
                </tr>
                <tr>
                  <th>Intelligence</th>
                  <td>{breed.intelligence}</td>
                </tr>
                <tr>
                  <th>Health Issues</th>
                  <td>{breed.health_issues}</td>
                </tr>
                <tr>
                  <th>Social Needs</th>
                  <td>{breed.social_needs}</td>
                </tr>
                <tr>
                  <th>Stranger Friendly</th>
                  <td>{breed.stranger_friendly}</td>
                </tr>    
              </tbody>
              </table>
          </section>
        </>
        }
      </main>

      <BreedImages breedId={breed.id} />
    </>
  )
}

