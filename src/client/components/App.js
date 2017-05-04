import React, { Component } from 'react'

import _ from 'lodash'

import io from 'socket.io-client'
const socket = io.connect('http://localhost:3000')

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
    const stocks = []
    //get init stocks from database
    socket.emit('get-stocks')
    // receive init stocks from database
    socket.on('get-stocks', stock => {
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
      let index = _.findIndex(this.state.stocks, {name: stock.name})
      this.state.stocks.splice(index, 1)
      this.setState({
        stocks: this.state.stocks
      })
    })
    // add stock to the database
    socket.on('add-stock', stock => {
      this.state.stocks.push(stock)
      this.setState({
        stocks: this.state.stocks
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
      <StockChart stocks={stocks} />
      <div className='container-fluid stocks-container'>
        <div className='row'>
          {stocks.map(stock => {
            return (
              <div key={stock.id} className='col-md-4'>
                <div className='col-md-12 stock-container'>
                  <h1>{stock.name}</h1>
                  <button value={stock.name} onClick={this.handleDeleteStock} className='btn btn-warning'>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='search-container'>
        <input onChange={this.handleInputStock} type='text' value={stock}/>
        <button onClick={this.handleSubmitStock}>Submit</button>
      </div>
      {error && <h1>{error}</h1>}
    </div>
    )
  }
}

export default App
