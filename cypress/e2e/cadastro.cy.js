import signupPage from '../support/pages/signup'

describe.only('cadastro de usuário', function () {

    before(function(){
        cy.fixture('signup').then(function(signup){
            this.success = signup.success
            this.email_dup = signup.email_dup
            this.email_inv = signup.email_inv
            this.short_password = signup.short_password
        })
    })

    context('quando é um novo usuário', function () {
        

        before(function () {
            //removendo usuário para garantir que não exista no banco
            cy.task('removeUser', this.success.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('criando um novo cadastro com sucesso', function () {

            signupPage.go()
            signupPage.form(this.success)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

        })
    })

    context('quando o email já existe', function () {
        
        before(function () {
            cy.postUser(this.email_dup)
        })
        it('deve informar que email já está cadastrado', function () {

            signupPage.go()
            signupPage.form(this.email_dup)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')

        })
    })

    context('preenchendo com email inválido', function () {
  

        it('deve informar que email já está cadastrado', function () {

            signupPage.go()
            signupPage.form(this.email_inv)
            signupPage.submit()
            signupPage.alert.haveText('Informe um email válido')
        })
    })

    context('senha com menos de 6 caracteres', function () {

        const passwords = ['1', 'a2', 'ab3', 'abc4', 'abcd5']

        passwords.forEach(function (p) {

            it('não deve permitir o cadastrado com a senha: ' + p, function () {

                this.short_password.password = p
                signupPage.go()
                signupPage.form(this.short_password)
                signupPage.submit()

            })
        })

        afterEach(function () {
            signupPage.alert.haveText('Pelo menos 6 caracteres')
        })
    })

    context('deixando campos obrigatórios em branco', function () {

        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        beforeEach(function () {
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function (alert) {
            it('deve exibir ' + alert.toLowerCase(), function() {
                signupPage.alert.haveText(alert)
            })
        })
    })
})

/* para usar faker dados
import { faker } from '@faker-js/faker'
const name = faker.name.fullName()
const email = faker.internet.email()
const password = 'thigu123' 

Para interceptar o post e faz um retorno falso de sucesso 
cy.intercept('POST', '/users', {
    statusCode: 200
}).as('postUser') 

cy.wait('@postUser')
*/
