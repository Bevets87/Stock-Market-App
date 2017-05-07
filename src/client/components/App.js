import React, { Component } from 'react'

import _ from 'lodash'

import io from 'socket.io-client'
const DEV_HOST = 'http://localhost:3000'
//const PROD_HOST = 'https://fcc-stock-market-application.herokuapp.com/'
const socket = io.connect(DEV_HOST)

import StockChart from './StockChart'

import './App.scss'

class App extends Component {
  constructor (props) {
    super (props)
    this.state = {
      stock: '',
      stocks: [],
      error: null
    }
    this.handleInputStock = this.handleInputStock.bind(this)
    this.handleSubmitStock = this.handleSubmitStock.bind(this)
  }
  componentWillMount () {
    this.setState({
      stocks: []
    })
    //get init stocks from database
    socket.emit('get-stocks')
    // receive init stocks from database
    socket.on('get-stocks', stock => {
      console.log(stock)
      var stocks = this.state.stocks.slice()
      stocks.push(stock)
      this.setState({
        stocks: stocks
      })
    })
  }
  componentDidMount () {
    // handle server errors
    socket.on('log-error', error => {
      this.setState({
        error: error
      })
    })
    // delete stock from database
    socket.on('delete-stock', stock => {
      var stocks = this.state.stocks.slice()
      let index = _.findIndex(stocks, {name: stock.name})
      stocks.splice(index, 1)
      this.setState({
        stocks: stocks
      })
    })
    // add stock to the database
    socket.on('add-stock', stock => {
      var stocks = this.state.stocks.slice()
      stocks.push(stock)
      this.setState({
        stocks: stocks
      })
    })
  }
  handleInputStock (event) {
    this.setState({
      stock: event.target.value
    })
  }
  handleSubmitStock (event) {
    event.preventDefault()
    const { stock } = this.state
    socket.emit('add-stock', stock)
    this.setState({
      stock: '',
      error: null
    })
  }
  handleDeleteStock (event) {
    event.preventDefault()
    socket.emit('delete-stock', event.target.value)
  }
  render () {
    const { stocks, stock, error } = this.state
    return (
      <div>
      <div className='app-container'>
      <div className='title-container'>
      <h1>$tock Chart$</h1>
      <div className='search-container'>
        <input onChange={this.handleInputStock} type='text' placeholder='search a stock symbol' value={stock}/>
        <button onClick={this.handleSubmitStock}>Submit</button>
      </div>
      {error && <h4 className='error'>{error}</h4>}
      </div>
      <StockChart stocks={stocks} />
      <div className='container-fluid stocks-container'>
        <div className='row'>
          {stocks.map(stock => {
            console.log(stock)
            return (
              <div key={stock.id} className='col-sm-2'>
                <div className='col-sm-12 stock-container'>
                  <h2>{stock.name}</h2>
                  <h6>{stock.data.dataset.name}</h6>
                  <button value={stock.name} onClick={this.handleDeleteStock} className='btn'>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    </div>
    )
  }
}

export default App
