
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FONT_AWESOME_PATH = process.env.NODE_ENV ?
  "'//netdna.bootstrapcdn.com/font-awesome/4.7.0/fonts'" :
  "'/node_modules/font-awesome/fonts'"

var config = {
  entry: './index.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "sass-loader", // compiles Sass to CSS
              options: {
                data: "$fa-font-path: " + FONT_AWESOME_PATH + ";"
              }
          }]
        })
    }]
  },
  plugins: [
    new ExtractTextPlugin("bundle.css"),
  ]
}


module.exports = config
