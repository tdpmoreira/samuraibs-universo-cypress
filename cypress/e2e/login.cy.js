import loginPage from '../support/pages/login'
import dashPage from '../support/pages/dash'

describe('login', function () {

    context('dados de login corretos', function () {

        const user = {
            name: 'Pablo Vittar',
            email: 'vittar@gmail.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function () {
            cy.postUser(user)
        })

        it('deve logar com sucesso', function () {
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()
            dashPage.header.userLogedIn(user.name)

        })
    })

    context('senha incorreta', function () {

        let user = {
            name: 'Gloria Groove',
            email: 'groove@gmail.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function () {
            cy.postUser(user).then(function(){
                user.password = 'abc123'
            })
        })

        it('deve notificar erro de credenciais', function () {
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()
            
            const message = 'Ocorreu um erro ao fazer login, verifique suas credenciais.'

            loginPage.toast.shouldHaveText(message)
        })
    })

    context('formato de email inválido', function(){
        
        const emails = [
            'email.com.br',
            'gmail.com',
            '@hotmail.com',
            'jose@'
        ]

        before(function(){
            loginPage.go()
        })

        emails.forEach(function(email){
            it('não deve logar com o email: ' + email, function(){
                const user = {email: email, password: 'pwd123'}
                
                loginPage.form(user)
                loginPage.submit()

                loginPage.alert.haveText('Informe um email válido')
            })
        })
    })

    context('deixando campos obrigatórios em branco', function () {

        const alertMessages = [
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        beforeEach(function () {
            loginPage.go()
            loginPage.submit()
        })

        alertMessages.forEach(function (alert) {
            it('deve exibir ' + alert.toLowerCase(), function() {
                loginPage.alert.haveText(alert)
            })
        })
    })

})