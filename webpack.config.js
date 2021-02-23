const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const SOURCE_PATH = path.resolve(__dirname, 'src');
const DEMO_PATH = path.resolve(__dirname, 'demo');

const demoConfig = {

   mode: 'development',

   name: 'demo',

   entry: DEMO_PATH,

   output: {
      library: 'PolyChart',
      libraryTarget: 'umd',
      filename: 'poly-chart.js'
   },

   resolve: {
      extensions: ['.js', '.json'],
      alias: { "@poly-chart": SOURCE_PATH }
   },

   module: {
      rules: [{ test: /\.(js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }],
   },

   plugins: [
      new HtmlWebpackPlugin({ template: path.join(DEMO_PATH, 'index.html') })
   ],

   devServer: {
      port: 1996,
      open: true
   }

};

const prodConfig = {

   mode: 'production',

   name: 'prod',

   entry: SOURCE_PATH,

   output: {
      library: 'PolyChart',
      libraryTarget: 'umd',
      filename: 'poly-chart.js',
      path: path.resolve(__dirname, 'build'),
   },

   resolve: {
      extensions: ['.js', '.json']
   },

   module: {
      rules: [{ test: /\.(js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }],
   },

   optimization: {
      minimizer: [new TerserPlugin({
         extractComments: false,
      })],
   },

};

module.exports = [
   demoConfig,
   prodConfig
];
