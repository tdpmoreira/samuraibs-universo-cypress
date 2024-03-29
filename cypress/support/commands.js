// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import moment from 'moment'
//import {apiServer} from '../../cypress.config.js'
import loginPage from './pages/login'
import dashPage from './pages/dash'

//App Actions
Cypress.Commands.add('uiLogin', function (user) {
    loginPage.go()
    loginPage.form(user)
    loginPage.submit()
    dashPage.header.userLogedIn(user.name)
})

Cypress.Commands.add('postUser', function (user) {
    cy.task('removeUser', user.email)
        .then(function (result) {
            console.log(result)
        })

    cy.request(
        'POST',
        'https://samuraibs-api-thigu.fly.dev/users',
        user
    ).then(function (response) {
        expect(response.status).to.eq(200)
    })
})

Cypress.Commands.add('recoveryPass', function (email) {
    cy.request(
        'POST',
        'https://samuraibs-api-thigu.fly.dev/password/forgot',
        { email: email }
    ).then(function (response) {
        expect(response.status).to.eq(204)

        cy.task('findToken', email)
            .then(function (result) {
                Cypress.env('recoveryToken', result.token)
            })
    })
})

Cypress.Commands.add('createAppointment', function (hour) {

    let now = new Date()
    now.setDate(now.getDate() + 1)

    Cypress.env('appointmentDate', now)

    const date = moment(now).format(`YYYY-MM-DD ${hour}:00`)

    const payload = {
        provider_id: Cypress.env('barberId'),
        date: date
    }

    cy.request({
        method: 'POST',
        url: 'https://samuraibs-api-thigu.fly.dev/appointments',
        body: payload,
        headers: {
            authorization: 'Bearer ' + Cypress.env('apiToken')
        }
    }).then(function (response) {
        expect(response.status).to.eq(200)
    })
})

Cypress.Commands.add('setProviderId', function (barberEmail) {
    cy.request({
        method: 'GET',
        url: 'https://samuraibs-api-thigu.fly.dev/providers',
        headers: {
            authorization: 'Bearer ' + Cypress.env('apiToken')
        }
    }).then(function (response) {
        expect(response.status).to.eq(200)
        console.log(response.body)

        const barberList = response.body

        barberList.forEach(function (barber) {
            if (barber.email == barberEmail) {
                Cypress.env('barberId', barber.id)
            }
        });

    })
})

Cypress.Commands.add('apiLogin', function (user, setLocalStorage = false) {
    const payload = {
        email: user.email,
        password: user.password
    }

    cy.request({
        method: 'POST',
        url: 'https://samuraibs-api-thigu.fly.dev/sessions',
        body: payload
    }).then(function (response) {
        expect(response.status).to.eq(200)
        Cypress.env('apiToken', response.body.token)

        if (setLocalStorage) {

            const { token, user } = response.body

            window.localStorage.setItem('@Samurai:token', token)
            window.localStorage.setItem('@Samurai:user', JSON.stringify(user))
        }
    })

    if (setLocalStorage) cy.visit('/dashboard')
})