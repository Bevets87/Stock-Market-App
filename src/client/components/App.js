import React, { Component } from 'react'

import io from 'socket.io-client'
const socket = io.connect('http://localhost:3000')

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
  componentDidMount () {
    const stocks = []
    //request stocks from server
    socket.emit('get-stocks')
    // receive stocks from server
    socket.on('stocks', response => {
      stocks.push(response)
      this.setState({
        stocks: stocks
      })

    })
    // receive stock from server
    socket.on('add-stock', stock => {
      console.log(stock)
    })
    // receive any error from server
    socket.on('log-error', error => {
      console.log(error)

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
    socket.emit('get-stocks')
    this.setState({
      stock: ''
    })
  }
  render () {
    var { stocks, stock } = this.state
    return (
      <div className='app-container'>
        <h1>Stocks:</h1>
        <ol className='stocks'>
          {stocks.map(stock => <li key={stock.dataset.id}>{stock.dataset.dataset_code}</li>)}
        </ol>
        <div className='container'>
          <input onChange={this.handleInputStock} type='text' value={stock}/>
          <button onClick={this.handleSubmitStock}>Submit</button>
        </div>
      </div>
    )
  }
}

export default App
