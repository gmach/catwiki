import React, { useState } from "react";

export default function BreedsTopSearches({breedsSearched}) {
  const [showHits, setShowHits] = useState(false);
  const showSearchedHits = () => {
    setShowHits(!showHits)
  }
return (
  <>
    <button className="searchedBreedsButton" onClick={showSearchedHits}>Most Searched Breeds</button>
    <div className="searchWrap" >
      <div className="searchHitsWrap">
      {
        showHits && breedsSearched && 
        breedsSearched.map(breed => (<div className='searchHits' key={breed.id}>{breed.name} : {breed.searchHits}</div>))
      }
      </div>
    </div>
  </>
  )
}
