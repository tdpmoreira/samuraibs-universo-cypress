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
            
            //cy.uiLogin(barber)
            cy.apiLogin(barber, true)

            dashPage.calendarShoudBeVisible()

            const date = Cypress.env('appointmentDate')
            dashPage.selectDay(date)
            dashPage.appointmentShouldBeVisible(customer, appointment.hour)
        })
    })
})

