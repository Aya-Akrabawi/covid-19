'use strict'

//Dependencies
require('dotenv').config();
const express = require('express')
const app = express();
const PORT = process.env.PORT || 8080;
const superagent = require('superagent')
const methodOverride = require('method-override')
const cors = require('cors')
const dotenv = require('dotenv')
const pg = require('pg')


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);

//routes:
app.get('/', homePage)


//functions:
function homePage(req, res) {
  let url = `https://api.covid19api.com/world/total`

  superagent.get(url).then(results => {
    let statistics = results.body
    console.log(statistics.TotalConfirmed);
    res.render('index.ejs', {statt : statistics})
  })
}

app.listen(PORT, () => {
  console.log(`Example app listening to port:${PORT}`)
})

  
