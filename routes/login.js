'use strict'

var utils = require('../lib/utils')
var insecurity = require('../lib/insecurity')
var models = require('../models/index')
var challenges = require('../data/datacache').challenges

exports = module.exports = function login () {
  function afterLogin (user, res, next) {
    if (utils.notSolved(challenges.loginAdminChallenge) && user.data.id === 1) {
      utils.solve(challenges.loginAdminChallenge)
    } else if (utils.notSolved(challenges.loginJimChallenge) && user.data.id === 2) {
      utils.solve(challenges.loginJimChallenge)
    } else if (utils.notSolved(challenges.loginBenderChallenge) && user.data.id === 3) {
      utils.solve(challenges.loginBenderChallenge)
    }
    models.Basket.findOrCreate({ UserId: user.data.id }).success(function (basket) {
      var token = insecurity.authorize(user)
      user.bid = basket.id // keep track of original basket for challenge solution check
      insecurity.authenticatedUsers.put(token, user)
      res.json({ token: token, bid: basket.id, umail: user.data.email })
    }).error(function (error) {
      next(error)
    })
  }

  return function (req, res, next) {
    if (utils.notSolved(challenges.weakPasswordChallenge) && req.body.email === 'admin@juice-sh.op' && req.body.password === 'admin123') {
      utils.solve(challenges.weakPasswordChallenge)
    }
    if (utils.notSolved(challenges.loginSupportChallenge) && req.body.email === 'support@juice-sh.op' && req.body.password === 'J6aVjTgOpRs$?5l+Zkq2AYnCE@RF§P') {
      utils.solve(challenges.loginSupportChallenge)
    }
    if (utils.notSolved(challenges.oauthUserPasswordChallenge) && req.body.email === 'bjoern.kimminich@googlemail.com' && req.body.password === 'YmpvZXJuLmtpbW1pbmljaEBnb29nbGVtYWlsLmNvbQ==') {
      utils.solve(challenges.oauthUserPasswordChallenge)
    }
    models.sequelize.query('SELECT * FROM Users WHERE email = \'' + (req.body.email || '') + '\' AND password = \'' + insecurity.hash(req.body.password || '') + '\'', models.User, { plain: true })
      .success(function (authenticatedUser) {
        var user = utils.queryResultToJson(authenticatedUser)

        var rememberedEmail = insecurity.userEmailFrom(req)
        if (rememberedEmail && req.body.oauth) {
          models.User.find({ where: {email: rememberedEmail} }).success(function (rememberedUser) {
            user = utils.queryResultToJson(rememberedUser)
            if (utils.notSolved(challenges.loginCisoChallenge) && user.data.id === 5) {
              utils.solve(challenges.loginCisoChallenge)
            }
            afterLogin(user, res, next)
          })
        } else if (user.data && user.data.id) {
          afterLogin(user, res, next)
        } else {
          res.status(401).send('Invalid email or password.')
        }
      }).error(function (error) {
        next(error)
      })
  }
}
