const path = require ('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.resolve(__dirname, 'src/client') + '/index.js'
  ],
  output: {
    path: '/',
    publicPath: '/',
    filename: 'bundle.js'
  },
plugins: [
   new webpack.NoEmitOnErrorsPlugin(),
   new webpack.optimize.OccurrenceOrderPlugin(),
   new webpack.HotModuleReplacementPlugin()
 ],
module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/client'),
        loaders: ['react-hot-loader','babel-loader', 'eslint-loader']
      },
      {
        test: /\.s?css$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  }
}
