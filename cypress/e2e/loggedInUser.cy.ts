import { prepareDisplayUserIntercept, prepareLoginIntercept } from "../support/interactInterceptors/loginInterceptorBefore";

//Templates for executing custom commands like login and displayAdminUserHome you can find 
//in support folder
describe('Current log in user details shows', () => {
    const useLodash = require('lodash');
    const REQUEST_BASE_URL = Cypress.env('VITE_API_BASE_URL')
    let fakeAdminAccessToken = 'accessTokenAdmin1';
    let fakeAdminRefreshToken = 'refreshTokenAdmin1';

    beforeEach(() =>{
        prepareLoginIntercept(useLodash, REQUEST_BASE_URL, fakeAdminAccessToken)
        prepareDisplayUserIntercept(REQUEST_BASE_URL, fakeAdminAccessToken)
    })

    it('After login admin user can go to see list of users', () => {
        cy.login(
            {email:'user@mail.com', password:'password'}, 
            fakeAdminAccessToken, fakeAdminRefreshToken
        )
        cy.displayAdminUserHome()
        cy.get('#menuIconId').click()
        cy.moveToMenuOption('/users-list')
    })
})