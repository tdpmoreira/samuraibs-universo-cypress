import signupPage from '../support/pages/signup'

describe('cadastro de usuário', function () {

    context('quando é um novo usuário', function () {
        const user = {
            name: 'Thiago Moreira',
            email: 'tdamiany@gmail.com',
            password: 'thigu123'
        }

        before(function () {
            //removendo usuário para garantir que não exista no banco
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('criando um novo cadastro com sucesso', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

        })
    })

    context('quando o email já existe', function () {
        const user = {
            name: 'Julien Bauch',
            email: 'Julien.Bauch@hotmail.com',
            password: 'thigu123',
            is_provider: true
        }

        before(function () {
            cy.postUser(user)
        })
        it('deve informar que email já está cadastrado', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')

        })
    })

    context('preenchendo com email inválido', function () {

        const user = {
            name: 'Juliano José',
            email: 'Juliano.jose.hotmail.com',
            password: 'thigu123',
        }

        it('deve informar que email já está cadastrado', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('senha com menos de 6 caracteres', function () {

        const passwords = ['1', 'a2', 'ab3', 'abc4', 'abcd5']

        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {

            it('não deve permitir o cadastrado com a senha: ' + p, function () {

                const user = {
                    name: 'Juliano José',
                    email: 'Juliano.jose@hotmail.com',
                    password: p,
                }

                signupPage.form(user)
                signupPage.submit()

            })
        })

        afterEach(function () {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })

    context.only('deixando campos obrigatórios em branco', function () {

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
                signupPage.alertHaveText(alert)
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
