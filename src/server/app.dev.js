import path from 'path'
import http from 'http'
import express from 'express'

import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../../webpack.config.dev'
const compiler = webpack(webpackConfig)

let app = express()
let server = http.createServer(app)
let io = require('socket.io')(server)

app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}))
app.use(webpackHotMiddleware(compiler))
app.use(express.static(path.join(__dirname, '../client' )))

io.on('connection', socket => {
  console.log('socket connected')
})

server.listen(process.env.PORT || 3000, () => {
  console.log(`listening on localhost ${process.env.PORT || 3000}` )
})
