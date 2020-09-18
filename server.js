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
app.post('/getCountryResult', takeDate )
app.get('/allCountries',allCountriesFunc)


//functions:
function homePage(req, res) {
  let url = `https://api.covid19api.com/world/total`

  superagent.get(url).then(results => {
    let statistics = results.body
    // console.log(statistics.TotalConfirmed);
    res.render('index.ejs', {statt : statistics})
  })
}

function takeDate(req,res){
  // console.log(req.body)
  let {country,date1,date2} = req.body
  let url = `https://api.covid19api.com/country/${country}/status/confirmed?from=${date1}T00:00:00Z&to=${date2}T00:00:00Z`
 superagent.get(url).then((result)=>{
   console.log('result',result.body)
  res.redirect('/getCountryResult')
  res.render('countryRes', {banana: result.body})
 })
}

function allCountriesFunc (req,res){
  let sql = `INSERT INTO (column_list)
  VALUES (value_list), 
         (value_list), …; `
  let url = `https://api.covid19api.com/summary`
  client.query

}

client.connect().then(()=>{
  app.listen(PORT, () => {
    console.log(`Example app listening to port:${PORT}`)
  })
})


 
