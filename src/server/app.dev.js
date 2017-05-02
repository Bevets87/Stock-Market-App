import path from 'path'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import mongoose from 'mongoose'
import Stock from './models/Stock'

/* packages needed for using the server in dev mode */
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../../webpack.config.dev'
const compiler = webpack(webpackConfig)

/* create server */
let app = express()
let server = http.createServer(app)
let io = require('socket.io')(server)

/* add webpack middleware for use in dev mode */
app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}))
app.use(webpackHotMiddleware(compiler))

/* add express middleware */
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../client' )))

/* add socket connection */
io.on('connection', socket => {
  /* add stock to database */
  socket.on('add-stock', stockToAdd => {
    Stock.findOne({name: stockToAdd}, (err, stock) => {
      if (err) return console.error(err)
      if (!stock) {
        stock = new Stock({
          name: stockToAdd
        })
        stock.save((err, stock) => {
          if (err) return console.error(err)
          io.emit('add-stock', stock)
        })
      } else {
        console.log('The stock is already in the database')
      }
    })
  })
  /* delete stock from databse */
  socket.on('delete-stock', stockToDelete => {
    Stock.findOneAndRemove({name: stockToDelete}, (err, stock) => {
      if (err) return console.error(err)
      io.emit('delete-stock', stock)
    })
  })
  /* get stocks from databse, make a req to quandl, emit results */
  socket.on('get-stocks', () => {
    Stock.find((err, stocks) => {
      if (err) return console.error(err)
      stocks.map( stock => {
        var date = new Date()
        var start_date = (date.getFullYear() - 1) + '-' + date.getDate() + '-' + date.getDay()
        var end_date = date.getFullYear() + '-' + date.getDate() + '-' + date.getDay()
        var api_key = 'JntJ6C3cd_kuJDkJ9pMs'
        axios.get(`https://www.quandl.com/api/v3/datasets/WIKI/${stock.name}.json?start_date=${start_date}&end_date=${end_date}&api_key=${api_key}`)
          .then(response => {
            io.emit('stocks', response.data)
          })
          .catch(error => {
            io.emit('log-error', error)
          })
      })
    })
  })
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
