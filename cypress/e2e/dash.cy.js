import loginPage from '../support/pages/login'
import dashPage from '../support/pages/dash'
import { customer, barber, appointment } from '../support/factories/dash'

describe('dashboard', function () {

    context('quando o cliente faz um agendamento no app mobile', function () {

        before(function () {
            cy.postUser(customer)
            cy.postUser(barber)

            cy.apiLogin(customer)

            cy.setProviderId(barber.email)

            cy.createAppointment(appointment.hour)
        })

        it('o agendamento deve ser exibido no dashboard', function () {
            loginPage.go()
            loginPage.form(barber)
            loginPage.submit()

            dashPage.calendarShoudBeVisible()

            const day = Cypress.env('appointmentDay')
            dashPage.selectDay(day)
            dashPage.appointmentShouldBeVisible(customer, appointment.hour)
        })
    })
})

