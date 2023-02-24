import express from 'express'
import cors from 'cors'
import path from 'path'

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../client/public')))
app.use(cors({ origin: '*' }))

const PORT = process.env.PORT || 3001
export const CAT_API = 'https://api.thecatapi.com/v1'
const CAT_API_KEY = 'live_v76huEqVhircA1zkE6TKzuP5CXjzcmI3D7bgmtlJIi6oixPXRMazY34tfmw8zaE4'
const LIMIT_PER_PAGE = 10
const MAX_LIMIT_PER_PAGE = 100
let memCache = {}

app.get("/api", (req, res) => {
  res.json({ message: "Hello from CatWiki!" })
})

// preFetch with breed images for carousal
const preFetch = async () => {
  let breeds = {}
  let results = await fetch(`${CAT_API}/breeds`)
  results = await results.json()
  let countAdded = 0

  results.map(async breed => {
    if (breed) {
      if (breed.reference_image_id) {
        try {
          results = await fetch(`${CAT_API}/images/${breed.reference_image_id}`)
          results = await results.json()
        } catch (e) { // rate limited 
          await (new Promise(resolve => setTimeout(resolve, 1000)))
          results = await fetch(`${CAT_API}/images/${breed.reference_image_id}`)
          results = await results.json()
        }
        breed.reference_image_url = results.url
        breed.searchHits = 0
        breeds[breed.id] = breed
        memCache.breeds = breeds
        console.log( ++countAdded + ' added breed ' + ' ' + breed.name)
      }
    }
  })

}

// get all breed details
app.get("/api/breeds", async (req, res) => {
  let results
  try {
    results = memCache.breeds
    if (!results) {
      results = await fetch(`${CAT_API}/breeds`)
      results = await results.json()
      memCache.breeds = breeds
    }
    res.json(results)
  } catch (error) {
    console.error(error)
    res.status(404).send("Data unavailable")
  }
})

// get cat images for breed and page
app.get("/api/images/:breed_id/:page", async (req, res) => {
  let results
  const breed_id = req.params.breed_id
  const page = parseInt(req.params.page)
  try {

    results = memCache[breed_id + page]
    if (!results) {
      results = await fetch(`${CAT_API}/images/search?format=json&order=ASC&limit=${LIMIT_PER_PAGE}&include_breeds=false&include_categories=false&has_breeds=true&breed_ids=${breed_id}&page=${page}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CAT_API_KEY
        }
      })
      // const responseHeaders = Object.fromEntries([...results.headers])
      // const pageNum = parseInt(responseHeaders['pagination-page'])
      // const count = parseInt(responseHeaders['pagination-count'])
      // const limit = parseInt(responseHeaders['pagination-limit'])
      results = await results.json()
      memCache[breed_id + page] = results
    }
    res.json(results)
  } catch (error) {
    console.error(error)
    res.status(404).send("Data unavailable")
  }
})

// get image if request id exists else 5 random images
app.get("/api/images", async (req, res) => {
  let results
  try {
    const imageId = req.query.id ? req.query.id : 'randomImages'
    const url = `${CAT_API}/images/${req.query.id ? imageId : 'search?format=json&limit=5&include_breeds=false&include_categories=false'}`
    results = memCache[imageId]
    if (!results) {
      results = await fetch(url, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CAT_API_KEY
        }
      })
      results = await results.json()
      if (imageId !== 'randomImages')
        memCache[imageId] = results
    }
    res.json(results)
  } catch (error) {
    console.error(error)
    res.status(404).send("Data unavailable")
  }
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

// registers search breed for counting
app.post("/api/search", async (req, res) => {
  const breedId = req.body.breedId
  ++memCache.breeds[breedId].searchHits
  res.json(memCache.breeds)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
  preFetch()
})