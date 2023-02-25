import express from 'express'
import cors from 'cors'
import path from 'path'
import axios from 'axios'

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
let db = {} // represent datastore. mock with memory cache 

app.get("/api", (req, res) => {
  res.json({ message: "Hello from CatWiki!" })
})

const initDB = async () => {
  let breeds = {}
  let results = (await axios.get(`${CAT_API}/breeds`)).data
  let countAdded = 0

  results.map(async breed => {
    if (breed) {
      if (breed.reference_image_id) {
        try {
          results = (await axios.get(`${CAT_API}/images/${breed.reference_image_id}`)).data
        } catch (e) { // rate limited 
          await (new Promise(resolve => setTimeout(resolve, 10000)))
          results = (await axios(`${CAT_API}/images/${breed.reference_image_id}`)).data
        }
        breed.reference_image_url = results.url
        breed.searchHits = 0
        breeds[breed.id] = breed
        db.breeds = breeds
        countAdded += 1
        console.log(countAdded + ' added breed ' + ' ' + breed.name)
      }
    }
  })
}

// get all breed details
app.get("/api/breeds", async (req, res) => {
  let results
  try {
    results = db.breeds
    if (!results) {
      results = (await axios.get(`${CAT_API}/breeds`)).data
      db.breeds = results
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

    results = db[breed_id + page]
    if (!results) {
      results = (await axios({
        method: 'GET', 
        url: `${CAT_API}/images/search?format=json&order=ASC&limit=${LIMIT_PER_PAGE}&include_breeds=false&include_categories=false&has_breeds=true&breed_ids=${breed_id}&page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CAT_API_KEY
        }
      })).data
      db[breed_id + page] = results
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
    results = db[imageId]
    if (!results) {
      results = (await axios({
        method: 'GET', 
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CAT_API_KEY
        }
      })).data
      if (imageId !== 'randomImages')
        db[imageId] = results
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
  db.breeds[breedId].searchHits += 1
  res.json(db.breeds)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
  initDB()
})