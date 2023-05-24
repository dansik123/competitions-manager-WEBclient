describe('Register attempt', () => {
  const REQUEST_BASE_URL = Cypress.env('VITE_API_BASE_URL')
  let registerData = {
    firstname: 'userFirstName',
    lastname: 'userLastName',
    email: 'userEmail@mail.com',
    password: 'userPassword'
  }

  let responseBodyOK = {
    timestamp: 'fake_timestamp',
    message: 'User userEmail@mail.com has been registered correctly'
  }

  let errorResponse403 = {
    timestamp: 'fake_date_and_time',
    message: 'Email is invalid',
    statusCode: 403
  }

  const useLodash = require('lodash');
  beforeEach(()=>{
    //intercept HTTP request for logging gives back 
    cy.intercept('POST', REQUEST_BASE_URL + '/register', (req) =>{
      if(useLodash.isEqual(req.body, registerData)){
        req.reply({
          statusCode: 201,
          body: responseBodyOK
        })
      }else{
        req.reply({
          statusCode: 403,
          body: errorResponse403
        })
      }
    }).as('apiRegister')
  })

  it('Valid register data should redirect to home page', () => {
    cy.visit('/register');
    cy.get('#firstname').type(registerData.firstname)
    cy.get('#lastname').type(registerData.lastname)
    cy.get('#email').type(registerData.email)
    cy.get('#password').type(registerData.password)
    cy.get('button[type=submit]').click()
    cy.wait('@apiRegister').then(({request, response})=>{
      expect(request.body).to.deep.equal(registerData, 'Request body data does not match');
      expect(response?.statusCode).to.eq(201, 'Response status code does not match');
      cy.location().should((location) =>{
          expect(location.pathname).to.eq('/', 'Redirected location does not match');
      })
    })
  })

  it('Unsuccesfull register process should show Toast error message given from error response', () => {
    let invalidRegistryData = Object.assign({}, registerData)
    invalidRegistryData.email = 'InvalidEmail'
    cy.visit('/register');
    cy.get('#firstname').type(invalidRegistryData.firstname)
    cy.get('#lastname').type(invalidRegistryData.lastname)
    cy.get('#email').type(invalidRegistryData.email)
    cy.get('#password').type(invalidRegistryData.password)
    cy.get('button[type=submit]').click()
    cy.wait('@apiRegister').then(({request, response})=>{
      expect(request.body).to.deep.equal(invalidRegistryData, 'Request body data does not match');
      expect(response?.statusCode).to.eq(403, 'Response status code does not match');
      cy.get('.notyfication-text').should('be.visible').should('contain', errorResponse403.message);
      cy.location().should((location) =>{
        expect(location.pathname).to.eq('/register', 'Fail register should not redirect');
      })
    })
  })
})