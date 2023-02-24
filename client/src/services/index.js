import config from '../config.json'

const getBreeds = async () => {
  let results = await fetch(`${config.REST_API}/breeds`)
  results = await results.json()
  return results
}

const getRandomImages = async () => {
  let results = await fetch(`${config.REST_API}/images`)
  results = await results.json()
  return results
}

const getImage = async (imageId) => {
  let results = await fetch(`${config.REST_API}/images?id=${imageId}`)
  results = await results.json()
  return results
}

const registerSearchHit = async (breedId) => {
  let results = await fetch(`${config.REST_API}/search`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      breedId
    })
  })
  const breeds = await results.json()
  return breeds
}

export {
  getBreeds,
  getRandomImages,
  getImage,
  registerSearchHit
}