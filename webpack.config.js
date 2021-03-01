const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const SOURCE_PATH = path.resolve(__dirname, 'src');
const DEMO_PATH = path.resolve(__dirname, 'demo');

const demoConfig = {

   mode: 'development',

   name: 'demo',

   entry: DEMO_PATH,

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

   devtool: 'source-map',

   devServer: {
      port: 1996,
      open: true
   }

};

const prodConfig = {

   mode: 'production',

   name: 'prod',

   entry: path.join(SOURCE_PATH, 'index.js'),

   output: {
      libraryTarget: 'umd',
      filename: 'poly-chart.js',
      globalObject: 'this',
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

   externals: {
      react: {
         root: 'React',
         commonjs: 'react',
         commonjs2: 'react',
         amd: 'react',
         umd: 'react'
      },
      'react-dom': {
         root: 'ReactDOM',
         commonjs: 'react-dom',
         commonjs2: 'react-dom',
         amd: 'react-dom',
         umd: 'react-dom'
      },
   }

};

module.exports = [
   demoConfig,
   prodConfig
];
