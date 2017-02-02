'use strict'

var path = require('path')
var utils = require('../lib/utils')
var challenges = require('../data/datacache').challenges

exports = module.exports = function servePremiumContent () {
  return function (req, res) {
    if (utils.notSolved(challenges.premiumPaywallChallenge)) {
      utils.solve(challenges.premiumPaywallChallenge)
    }
    res.sendFile(path.resolve(__dirname, '../app/private/under-construction.gif'))
  }
}
