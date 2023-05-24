describe('Login attempt', () => {
  const REQUEST_BASE_URL = Cypress.env('VITE_API_BASE_URL')
  let correctUserCredentials = {
    email: 'user@mail.com',
    password: 'password'
  }
  let fakeAccessToken = 'accessToken1';
  let fakeRefreshToken = 'refreshToken1';
  let errorBadCredentialsResponse = {
    timestamp: 'fake_date_and_time',
    message: 'Bad credentials',
    statusCode: 403
  }
  const useLodash = require('lodash');

  beforeEach(()=>{
    //intercept HTTP request for logging gives back 
    cy.intercept('POST', REQUEST_BASE_URL + '/login?client=browser', (req) =>{
      if(useLodash.isEqual(req.body, correctUserCredentials)){
        req.reply({
          headers: {
            'Set-Cookie': 'refreshToken=refreshToken1'
          },
          body:{
            accessToken: fakeAccessToken,
          }
        })
      }else{
        req.reply({
          statusCode: 403,
          body: errorBadCredentialsResponse
        })
      }
    }).as('apiLogin')
  })

  it('Valid username and pasword interted should redirect to about page', () => {
    cy.visit('/login');
    cy.get('#email').type(correctUserCredentials.email)
    cy.get('#password').type(correctUserCredentials.password)
    cy.get('button[type=submit]').click()
    cy.wait('@apiLogin').then(({request, response})=>{
      expect(response?.statusCode).to.eq(200, 'Response status code does not match');
      expect(response?.body['accessToken']).to.eq(fakeAccessToken, 'Response should have this access token')
      cy.getCookie('refreshToken').then((cookie)=>{
        expect(cookie?.value).to.eq(fakeRefreshToken, 'refresh token cookie does not match');
      })
      cy.location().should((location) =>{
        expect(location.pathname).to.eq('/user-home', 'Redirected location does not match');
      })
    })
  })

  it('Incorrect username or pasword should show Toast error message given from error response', () => {
    let wrongPassword = 'password345';
    cy.visit('/login');
    cy.get('#email').type(correctUserCredentials.email)
    cy.get('#password').type(wrongPassword)
    cy.get('button[type=submit]').click()
    cy.wait('@apiLogin').then(({request, response})=>{
      expect(response?.statusCode).to.eq(errorBadCredentialsResponse.statusCode, 'Response status code does not match');
      cy.get('.notyfication-text').should('be.visible').should('contain', errorBadCredentialsResponse.message);
      cy.location().should((location) =>{
        expect(location.pathname).to.eq('/login', 'Redirected location does not match');
      })
    })
  })
})