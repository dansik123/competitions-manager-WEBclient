/// <reference types="cypress" />

import type { ILoginRequest } from "@/types/HttpRequestTypes"
import type { User, GenericErrorResponse } from "@/types/HttpResponseTypes"

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      login(credentials: ILoginRequest, accessToken: string, refreshToken: string): Chainable<void>
      displayAdminUserHome(): Chainable<void>
      moveToMenuOption(menuLinkPath: string): Chainable<void>
    }
  }
}

export {}

Cypress.Commands.add('login', (credentials: ILoginRequest, accessToken: string, refreshToken: string)=>{
  cy.visit('/login');
  cy.get('#email').type(credentials.email)
  cy.get('#password').type(credentials.password)
  cy.get('button[type=submit]').click()
  cy.wait('@apiLogin').then(({request, response})=>{
    expect(response?.statusCode).to.eq(200, 'Response status code does not match');
    expect(response?.body['accessToken']).to.eq(accessToken, 'Response should have this access token')
    cy.getCookie('refreshToken').then((cookie)=>{
      expect(cookie?.value).to.eq(refreshToken, 'refresh token cookie does not match');
    })
    cy.location().should((location) =>{
      expect(location.pathname).to.eq('/user-home', 'Redirected location does not match');
    })
  })
})

Cypress.Commands.add('displayAdminUserHome',()=>{
  cy.wait('@apiCurrentUser').then(({request, response})=>{
    expect(response?.statusCode).to.eq(200, 'Response status code does not match');
  })
})

Cypress.Commands.add('moveToMenuOption', (menuLinkPath: string) => {
  cy.get(`a[href='${menuLinkPath}']`).click()
  cy.location().should((location) =>{
    expect(location.pathname).to.eq(menuLinkPath, 'Redirected location does not match');
  })
})