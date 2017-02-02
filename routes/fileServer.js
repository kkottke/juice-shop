'use strict'

var path = require('path')
var utils = require('../lib/utils')
var insecurity = require('../lib/insecurity')
var challenges = require('../data/datacache').challenges

exports = module.exports = function servePublicFiles () {
  return function (req, res, next) {
    var file = req.params.file
    var mdDebug = req.query.md_debug

    if (!file.includes('/')) {
      verify(file, res, next, mdDebug)
    } else {
      res.status(403)
      next(new Error('File names cannot contain forward slashes!'))
    }
  }

  function verify (file, res, next, mdDebug) {
    if (file && (utils.endsWith(file, '.md') || (utils.endsWith(file, '.pdf') || (file === 'incident-support.kdbx')))) {
      file = insecurity.cutOffPoisonNullByte(file)
      if (utils.notSolved(challenges.easterEggLevelOneChallenge) && file.toLowerCase() === 'eastere.gg') {
        utils.solve(challenges.easterEggLevelOneChallenge)
      } else if (utils.notSolved(challenges.directoryListingChallenge) && file.toLowerCase() === 'acquisitions.md') {
        utils.solve(challenges.directoryListingChallenge)
      } else if (utils.notSolved(challenges.forgottenDevBackupChallenge) && file.toLowerCase() === 'package.json.bak') {
        utils.solve(challenges.forgottenDevBackupChallenge)
      } else if (utils.notSolved(challenges.forgottenBackupChallenge) && file.toLowerCase() === 'coupons_2013.md.bak') {
        utils.solve(challenges.forgottenBackupChallenge)
      }
      res.sendFile(path.resolve(__dirname, '../ftp/', file))
    } else if (file && mdDebug && utils.contains(file, '.md') && (utils.endsWith(mdDebug, '.md') || utils.endsWith(mdDebug, '.pdf'))) {
      if (utils.notSolved(challenges.forgottenBackupChallenge) && file.toLowerCase() === 'coupons_2013.md.bak') {
        utils.solve(challenges.forgottenBackupChallenge)
      }
      res.sendFile(path.resolve(__dirname, '../ftp/', file))
    } else {
      res.status(403)
      next(new Error('Only .md and .pdf files are allowed!'))
    }
  }
}
