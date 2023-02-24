import React, { useEffect, useState } from "react";
import config from '../../config.json'

export default function BreedImages ({breedId}) {
  const [images, setImages] = useState([])
  let [page, setPage] = useState([0])
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    (async () => { 
      let res = await fetch(`${config.REST_API}/images/${breedId}/${page}`)
      res = await res.json()
      setImages(res)
     })()
  }, [breedId, page])

  const handlePrev = async () => {
    let nextPage = page === 0 ? 0 : page - 1
    setPage(nextPage)
    
    let res = await fetch(`${config.REST_API}/images/${breedId}/${page}`)
    res = await res.json()
    if (page === 0) {
      setPrevDisabled(true)
    } else {
      setImages(images => [...images, ...res])
      setNextDisabled(false)
    }
  }

  const handleNext = async () => {
    setPage(++page)
    let res = await fetch(`${config.REST_API}/images/${breedId}/${page}`)
    res = await res.json()
    if (res.length > 0) {
      setImages(images => [...images, ...res])
      setPrevDisabled(false)
    } else 
      setNextDisabled(true)
  }

  return (
    <>
      <h2 className="title">Other Photos</h2>
      <div className="imageGallery">
        { images && images.map(image => (
              <img 
                key={image.id}
                src={image.url} alt={image.id}
              />
            ))
          }
      </div>
      <div className='buttonsnav'>
        <button className='prevButton' disabled={prevDisabled} onClick={handlePrev}>Previous</button>
        <button className='nextButton' disabled={nextDisabled} onClick={handleNext}>Next</button>
      </div>
    </>
  )
}