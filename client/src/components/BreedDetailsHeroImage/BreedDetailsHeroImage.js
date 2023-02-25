import React, { useEffect, useState } from "react";
import { getImage } from "../../services";

export default function BreedDetailsHeroImage({breedName, breedId}) {
  const [imageUrl, setImageUrl] = useState('')
  useEffect(() => {
    (async () => { 
      const image = await getImage(breedId);
      setImageUrl(image.url)
     })()
  }, [breedId])

  return (
    <figure className="breedDetailsImage">
      <img src={imageUrl} 
          alt={breedId}/>
      <figcaption className="center">{breedName}</figcaption>
    </figure>
  )
}
