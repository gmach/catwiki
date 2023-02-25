import React, { useState } from "react";

export default function BreedsTopSearches({breedsSearched}) {
  const [showHits, setShowHits] = useState(false);
  const showSearchedHits = () => {
    setShowHits(!showHits)
  }
return (
  <>
    <span className="searchedBreedsButton" onClick={showSearchedHits}>Most Searched Breeds</span>
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
