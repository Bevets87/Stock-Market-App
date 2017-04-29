import React, { Component } from 'react'

import './App.scss'

class App extends Component {
  constructor (props) {
    super (props)
    this.state = {
      message: ''
    }
    this.handleMessageInput = this.handleMessageInput.bind(this)
    this.handleSubmitMessage = this.handleSubmitMessage.bind(this)
  }
  handleMessageInput (event) {
    this.setState({
      message: event.target.value
    })
  }
  handleSubmitMessage (event) {
    event.preventDefault()
    var { message } = this.state
    var socket = io()
    socket.emit('message', message)
    this.setState({
      message: ''
    })
  }
  render () {
    return (
      <div className='app-container'>
        <ul></ul>
        <input onChange={this.handleMessageInput} type='text' />
        <button onClick={this.handleSubmitMessage}></button>
      </div>
    )
  }
}

export default App
