const { defineConfig } = require("cypress");
//const { fromCallback } = require("cypress/types/bluebird");
const { Pool } = require('pg')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
      const pool = new Pool(config.dbConfig)
      
      on('task', {
        removeUser(email){
          return new Promise(function(resolve){
            pool.query('DELETE FROM public.users WHERE email = $1', [email], function(error, result){
              if(error){
                throw error
              }
              resolve({success: result})
            })
          })
          
        },
        findToken(email){
          return new Promise(function(resolve){
            pool.query('SELECT B.token FROM ' +
            'public.users A ' +
            'INNER JOIN public.user_tokens B ' +
            'ON A.id = B.user_id ' +
            'WHERE A.email = $1 ' +
            'ORDER BY B.created_at', [email], function(error, result){
              if(error){
                throw error
              }
              resolve({token: result.rows[0].token})
            })
          })
        }
      })

    },
    baseUrl: 'https://samuraibs-web-thigu.fly.dev',
    apiServer: 'https://samuraibs-api-thigu.fly.dev',
    viewportHeight: 900,
    viewportWidth: 1440,
    defaultCommandTimeout: 30000,
    dbConfig: {
      host: 'lucky.db.elephantsql.com',
      user: 'axhozrmj',
      password: 'kvTKw_ZQnpw-hcVMtgleAOo7c5Gxy7sW',
      database: 'axhozrmj',
      port: 5432
    }
  },
});
