import React, { useEffect, useState } from "react";
import { getRandomImages } from "../../services";
export default function MainDescription() {
  const [randomImages, setRandomImages] = useState([])

  useEffect(() => {
    (async () => {
      setRandomImages(await getRandomImages())
    })()
  }, [])
  return (
    <>
      <div className="mainDescriptionWrapper">
        <h2 className="title">Why should you have a cat?</h2>
        <p className='description'>Having a cat around you can actually trigger the release of calming chemicals in your body which
          can lower your stress and anxiety levels
        </p>
        <div className="carousal">
          { randomImages && 
            randomImages.map(image => <img alt="" key={image.id} className='heroImage' src={image.url}/>)
          }
        </div>
      </div>
    </>
  )
}
