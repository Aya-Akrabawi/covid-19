'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const cors = require('cors');



app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);

//routes
app.get('/',homepage)
app.post('/getCountryResult',getResult)
app.get('/getCountryResult',renderResult)
app.get('/allCountries',allcountriesFunc)
app.post('/myRecords', myrecord)
app.get('/myRecords', renderRecord)
app.post('/details/:id',details)
app.put('/details/:id',updateRecord)
app.delete('/details/:id',deleting)



// functions
function homepage(req,res){
    let url = `https://api.covid19api.com/world/total`;
    superagent.get(url).then(result=>{
        res.render('index',{data:result.body})
    })
}
let resultArray = [];
function getResult(req,res){
    
    let {country, fromDate, toDate}=req.body;
    let url = `https://api.covid19api.com/country/${country}/status/confirmed?from=${fromDate}T00:00:00Z&to=${toDate}T00:00:00Z`
    superagent.get(url).then((result)=>{
        result.body.forEach(item=>{
           resultArray.push(new Result (item)) 
        })
        
        res.redirect('/getCountryResult')
    })
}

function renderResult(req,res){
    res.render('countryResult', {data:resultArray})
}

function allcountriesFunc(req,res){
    let countriesArray = [];
    let url = `https://api.covid19api.com/summary`
    superagent.get(url).then(result=>{
        result.body.Countries.forEach(element => {
            countriesArray.push(new Country (element))
        });
        res.render('countries',{data:countriesArray})
    })
}

function myrecord(req,res){
    let sql = `INSERT INTO corona (country, totalconfirmed, totaldeaths, totalrecovered, dates) VALUES ($1, $2, $3, $4,$5);`
    let value = [req.body.Country, req.body.TotalConfirmed, req.body.TotalDeaths, req.body.TotalRecovered, req.body.Date]
    client.query(sql,value).then(()=>{
        res.redirect('/myRecords');
    })
}

function renderRecord(req,res){
    let sql = `select * from corona`
    client.query(sql).then(result=>{
        res.render('records',{data:result.rows})
    })
}

function details(req,res){
    let sql = `select * from corona where id=$1`
    let value = [req.params.id]
    client.query(sql,value).then(result=>{
        res.render('details',{data:result.rows[0]})
    })
}

function updateRecord(req,res){
    let sql = `UPDATE corona SET country=$1 ,totalconfirmed=$2 ,totaldeaths=$3 ,totalrecovered=$4 ,dates=$5 WHERE id=$6;`
    let value = [req.body.Country, req.body.TotalConfirmed, req.body.TotalDeaths, req.body.TotalRecovered, req.body.Date, req.params.id]
    client.query(sql,value).then(()=>{
        res.redirect('/myRecords')
        // res.redirect(`/details/${req.params.id}`);
    })
}
function deleting(req,res){
    let sql = `delete from corona where id=$1`;
    let value = [req.params.id];
    client.query(sql,value).then(()=>{
        res.redirect('/myRecords')
    })
}

// constructors:
function Result(data){
    this.Date = data.Date;
    this.Cases = data.Cases;
}

function Country (data){
    this.Country = data.Country;
    this.TotalConfirmed = data.TotalConfirmed;
    this.TotalDeaths = data.TotalDeaths;
    this.TotalRecovered = data.TotalRecovered;
    this.Date = data.Date;
}

client.connect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`you are listening to port: ${PORT}`);
    })
})

