import path from 'path'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import mongoose from 'mongoose'
import Stock from './models/Stock'

let app = express()
let server = http.createServer(app)
let io = require('socket.io')(server)

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../../dist' )))

io.on('connection', socket => {
  /* add stock to database */
  socket.on('add-stock', stockToAdd => {
    stockToAdd = stockToAdd.toUpperCase()
    Stock.findOne({name: stockToAdd}, (err, stock) => {
      if (err) return console.error(err)
      if (!stock) {
        stock = new Stock({
          name: stockToAdd
        })
        stock.save((err, stock) => {
          if (err) return console.error(err)
          console.log('added stock to database')
          console.log(stock)
          var date = new Date()
          var start_date = (date.getFullYear() - 1) + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          var end_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          console.log('making request to quandl')
          axios.get(`https://www.quandl.com/api/v3/datasets/WIKI/${stock.name}.json?start_date=${start_date}&end_date=${end_date}&api_key=${process.env.API_KEY}`)
          .then(response => {
            io.emit('add-stock', {name: stock.name, id: stock._id, data: response.data})
          })
          .catch(error => {
            Stock.findOneAndRemove({name: stock.name}, (err, stock) => {
              if (err) return console.error(err)
              console.log('deleting stock from the database')
              console.log(stock)
              io.emit('log-error','invalid stock or request')
            })
          })
        })
      } else {
        io.emit('log-error','the stock is already in the database')
      }
    })
  })
  /* delete stock from databse */
  socket.on('delete-stock', stockToDelete => {
    stockToDelete = stockToDelete.toUpperCase()
    Stock.findOneAndRemove({name: stockToDelete}, (err, stock) => {
      if (err) return console.error(err)
      console.log('deleting stock from the database')
      console.log(stock)
      io.emit('delete-stock', stock)
    })
  })
  /* get stocks from databse, make a req to quandl, emit results */
  socket.on('get-stocks', () => {
    console.log('initializing stocks from the database')
    Stock.find((err, stocks) => {
      if (err) return console.error(err)
      stocks.map( stock => {
        var date = new Date()
        var start_date = (date.getFullYear() - 1) + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        var end_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        console.log('making request to quandl')
        axios.get(`https://www.quandl.com/api/v3/datasets/WIKI/${stock.name}.json?start_date=${start_date}&end_date=${end_date}&api_key=${process.env.API_KEY}`)
          .then(response => {
            io.emit('get-stocks', {name: stock.name, id: stock._id, data: response.data})
          })
          .catch(error => {
            console.log(error)
          })
      })
    })
  })

})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

/* connect to database in the form of mongodb */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/StockMarketApp')

mongoose.connection.once('open',function(){
  console.log('Connection has been made!')
}).on('error',function(error){
  console.log('Connection error:', error);
})

server.listen(process.env.PORT || 3000, () => {
  console.log(`listening on localhost ${process.env.PORT || 3000}` )
})
