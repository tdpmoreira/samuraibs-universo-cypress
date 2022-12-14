/// <reference types="cypress" />

import fpPage from "../support/pages/forgotpass"

describe('resgate de senha', function () {

  before(function () {
    cy.fixture('recovery').then(function (recovery) {
      this.data = recovery
    })
  })

  context('quando o usuário esquece a senha', function () {

    before(function () {
      cy.postUser(this.data)
    })

    it('deve poder resgatar por email', function () {
      fpPage.go()
      fpPage.form(this.data.email)
      fpPage.submit()

      const message = 'Ocorreu um erro ao tentar realizar a recuperação de senha'

      fpPage.toast.shouldHaveText(message)
    })
  })

  context.only('quando o usuário solicita o resgate', function () {

    before(function () {
      cy.postUser(this.data)
      cy.recoveryPass(this.data.email)
    })

    it('deve cadastrar a nova senha', function () {
      console.log('teste')
    })
  })
})
