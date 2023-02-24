import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import config from '../../config.json'
import MainDescription from "../MainDescription";
import { RootContext } from "../Root";
import BreedCarousal from "../BreedCarousal/BreedCarousal";
import { registerSearchHit } from "../../services";
import BreedsTopSearches from "../BreedsTopSearches/BreedsTopSearches";

export default function Home() {
  let { breeds, setBreeds } = useContext(RootContext)
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate()
  let arr = Object.entries(breeds).map(([, breed]) => breed).sort((a, b) => (a.id > b.id) ? 1: -1)
  const filteredBreeds = arr.filter(breed => (searchText === '' || breed.name.toLowerCase().startsWith(searchText.toLowerCase())))
  const breedsSearched =  arr.filter(breed => breed.searchHits>0).sort((a,b)=>b[1]-a[1]).slice(0, config.TOP_SEARCH_QTY)

  const handleKey = async e => {
    if (e.key === 'Enter' && filteredBreeds.length === 1) {
      const breed = filteredBreeds[0]
      await selectBreed(breed.id)
    }
  }

  const selectBreed = async breedId => {
    let results = await registerSearchHit(breedId);
    setBreeds(results)
    navigate(`/breed/${breedId}`); 
  }

  const handleChange = e => {
    setIsFocused(true)
    setSearchText(e.target.value)
  }

  const handleFocus = e => {
    setIsFocused(true)
  }

  const handleBlur = e => {
    // setIsFocused(false)
  }

  const handleSubmit = e => {
    e.preventDefault()
  }

  return (
    <>
      <div className="hero">
        <section className="heroTop">
          <h1>Cat Wiki</h1>
          <h3>Get to know more about your cat breed</h3>
          <form 
            className="searchContainer"
            onSubmit={handleSubmit}
          >
            <input
              className='searchBox'
              aria-label="Search breeds"
              placeholder="Search"
              value={searchText}
              onChange={handleChange}
              onKeyUp={handleKey}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <span
              className="search-spinner"
              aria-hidden
              hidden={!searchText !== ''}
            />
          {
            filteredBreeds.length ? (
            <div className={`breedsList ${ searchText === '' && !isFocused ? "": "showBreeds"}`}>
              {/* <select className="dropdown-menu" role="menu"
                onChange={handleSelect}
              >
                <option key='default'>Select breed ...</option>
                { filteredBreeds.length && filteredBreeds.map(breed => {
                  if (breed)
                    return (
                      <option 
                        key={breed.id}
                        value={breed.id} 
                      >{ breed.name ? breed.name : 'No Name' }
                      </option>
                    )
                    else return null
                  })
                }
              </select> */}

              <ul className="dropdown-menu" role="menu">
                { filteredBreeds.length && filteredBreeds.map(breed => {
                  if (breed)
                    return (
                      <li 
                        key={breed.id}>
                          <NavLink 
                            to={`/breed/${breed.id}`}
                            onClick={()=>selectBreed(breed.id)}
                            >{ breed.name ? breed.name : 'No Name' } 
                          </NavLink>
                      </li>
                    )
                    else return null
                  })
                }
              </ul>              
            </div>
            ) : (
              <p className='nobreeds'>No breeds matched</p>
            )
          }
          </form>
        </section>
        <section className="heroBottom">
          <BreedsTopSearches breedsSearched={breedsSearched} />
          <BreedCarousal breeds={arr} selectBreed={selectBreed}/>
        </section>     
      </div>
      <MainDescription/>
    </>
  );
}