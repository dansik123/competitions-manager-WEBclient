//Create intercept used By custom command to log in user
export const prepareLoginIntercept = 
    (useLodash: any, REQUEST_BASE_URL:string, fakeAdminAccessToken: string) =>{
        cy.fixture('toLogin/correctLoginCred.json').then((credData) =>{
            cy.fixture('toLogin/badCredentialsResponse.json').then((erroResponseData) =>{
                cy.intercept('POST', REQUEST_BASE_URL + '/login?client=browser', (req) =>{
                    if(useLodash.isEqual(req.body, credData)){
                    req.reply({
                        headers: {
                        'Set-Cookie': 'refreshToken=refreshTokenAdmin1'
                        },
                        body:{
                            accessToken: fakeAdminAccessToken,
                        }
                    })
                    }else{
                    req.reply({
                        statusCode: 403,
                        body: erroResponseData
                    })
                    }
                }).as('apiLogin')
            })
        })
    }

export const prepareDisplayUserIntercept = 
    (REQUEST_BASE_URL:string, fakeAdminAccessToken: string) =>{
        cy.fixture('loginUsers/loginAdmin.json').then(loginAdminData =>{
            cy.fixture('loginUsers/loginAccessTokenError.json').then(loginErrorData =>{
                cy.intercept('GET', REQUEST_BASE_URL + '/users/current', (req) =>{
                    if(req.headers['authorization'] == fakeAdminAccessToken){
                    req.reply({
                        statusCode: 200,
                        body: loginAdminData
                    })
                    }else{
                    req.reply({
                        statusCode: 403,
                        body: loginErrorData
                    })
                    }
                }).as('apiCurrentUser')
            })
        })
    }