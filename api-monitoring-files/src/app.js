'use strict'

const version = require('../package.json').version
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send(`api version: ${version}`)
})

module.exports = app
