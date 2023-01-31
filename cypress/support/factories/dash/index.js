import _ from 'underscore'

exports.customer = {
    name: 'Joelma',
        email: 'joelma@gmail.com',
        password: 'pwd123',
        is_provider: false
}

exports.barber = {
    name: 'Gloria Groove',
        email: 'groove@gmail.com',
        password: 'pwd123',
        is_provider: true
}

exports.appointment = {
    hour: _.sample(['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'])
}

