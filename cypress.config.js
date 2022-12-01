const { defineConfig } = require("cypress");
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
          
        }
      })

    },
    baseUrl: 'http://localhost:3000',
    viewportHeight: 900,
    viewportWidth: 1440,
    dbConfig: {
      host: 'lucky.db.elephantsql.com',
      user: 'axhozrmj',
      password: 'kvTKw_ZQnpw-hcVMtgleAOo7c5Gxy7sW',
      database: 'axhozrmj',
      port: 5432
    }
  },
});
