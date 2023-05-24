import Toast from '../Toast.vue'

describe('HelloWorld', () => {
  it('playground', () => {
    cy.mount(Toast, { props: { message: 'Hello Cypress', color: 'red',  icon: ''} })
  })

})
