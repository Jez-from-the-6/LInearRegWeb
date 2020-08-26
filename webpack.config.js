let config = require("./skeleton/webpack.config");
const path = require('path');
const entrypath = path.join(__dirname, '/index.tsx')
const outputpath = path.resolve(__dirname, 'dist')
const contentBase = path.join(__dirname, 'dist')

module.exports = config(entrypath, outputpath, contentBase)
