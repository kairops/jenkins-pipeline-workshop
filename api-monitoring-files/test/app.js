'use strict'

const request = require('supertest')
const { expect } = require('chai')
const app = require('../src/app')
const version = require('../package.json').version

describe('endpoint test', function () {
  it(`should resoponse correct api version ${version}`, function () {
    request(app)
    .get('/')
    .expect(200)
    .end(function(err, res) {
      expect(err).to.equal(null)
      expect(res.text).to.equal(`api version: ${version}`)
    })
  })
})
