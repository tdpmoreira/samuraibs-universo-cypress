import loginPage from '../support/pages/login'
import dashPage from '../support/pages/dash'

describe('dashboard', function(){

    context('quando o cliente faz um agendamento no app mobile', function(){

        const data = {
            customer: {
                name: 'Joelma',
                email: 'joelma@gmail.com',
                password: 'pwd123',
                is_provider: false
            },
            barber: {
                name: 'Gloria Groove',
                email: 'groove@gmail.com',
                password: 'pwd123',
                is_provider: true
            },
            appointmentHour: '14:00'
        }

        before(function(){
            cy.postUser(data.customer)
            cy.postUser(data.barber)

            cy.apiLogin(data.customer)

            cy.setProviderId(data.barber.email)

            cy.createAppointment(data.appointmentHour)
        })

        it('o agendamento deve ser exibido no dashboard', function(){
            loginPage.go()
            loginPage.form(data.barber)
            loginPage.submit()

            dashPage.calendarShoudBeVisible()
            
            const day = Cypress.env('appointmentDay')
            dashPage.selectDay(day)
            dashPage.appointmentShouldBeVisible(data.customer, data.appointmentHour)
        })
    })
})

