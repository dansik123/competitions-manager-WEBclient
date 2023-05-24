import type { User, GenericErrorResponse } from '../../src/types/HttpResponseTypes'

describe('Refresh attempt', () => {
  const REQUEST_BASE_URL = Cypress.env('VITE_API_BASE_URL')
  let fakeAccessToken = 'accessToken1'
  let fakeLoggedUser: User = {
    id: 33,
    firstName: 'Bob',
    lastName: 'Kane',
    email: 'bob@mail.com',
    role: 'USER'
  }
  let fakeErrorRefreshToken: GenericErrorResponse = {
    timestamp: 'fake_date_and_time_refresh',
    message: 'Refresh token authorization fail',
    statusCode: 403
  }
  let fakeErrorAccessToken: GenericErrorResponse = {
    timestamp: 'fake_date_and_time',
    message: 'Token authorization fail',
    statusCode: 403
  }

  beforeEach(()=>{
    //intercept refresh token request. Give back OK responce for requests contains cookie with following token 
    cy.intercept('GET', REQUEST_BASE_URL + '/refresh', (req) =>{
      if(req.headers['cookie'] == 'refreshToken=refreshTokenValue'){
        req.reply({
          statusCode: 200,
          body:{
            accessToken: fakeAccessToken,
          }
        })
      }else{
        req.reply({
          statusCode: 403,
          body: fakeErrorRefreshToken
        })
      }
    }).as('apiRefresh')

    //intercept user requests. Give back OK responce for requests contains following authorizaion token
    cy.intercept('GET', REQUEST_BASE_URL + '/users/current', (req) =>{
      if(req.headers['authorization'] == fakeAccessToken){
        req.reply({
          statusCode: 200,
          body: fakeLoggedUser
        })
      }else{
        req.reply({
          statusCode: 403,
          body: fakeErrorAccessToken
        })
      }
    }).as('apiCurrentUser')
  })
  
  it('Enter restricted page with refresh cookie', () => {
    cy.setCookie('refreshToken', 'refreshTokenValue');
    cy.visit('/user-home');
    cy.wait('@apiCurrentUser');
    cy.wait('@apiRefresh');
    cy.wait('@apiCurrentUser').then(({request, response})=>{
      expect(response?.statusCode).to.eq(200, 'Response status code does not match');
      cy.get('#user_id').should('be.visible').should('contain', fakeLoggedUser.id);
      cy.get('#user_firstname').should('be.visible').should('contain', fakeLoggedUser.firstName);
      cy.get('#user_lastname').should('be.visible').should('contain', fakeLoggedUser.lastName);
      cy.get('#user_email').should('be.visible').should('contain', fakeLoggedUser.email);
      cy.get('#user_role').should('be.visible').should('contain', fakeLoggedUser.role);
    })
  })

  it('Enter restricted page with refresh cookie', () => {
    cy.visit('/user-home');
    cy.wait('@apiCurrentUser');
    cy.wait('@apiRefresh').then(({request, response})=>{
      expect(response?.statusCode).to.eq(403, 'Response status code does not match');
      cy.get('.notyfication-text').should('be.visible').should('contain', fakeErrorRefreshToken.message);
    })
  })
})