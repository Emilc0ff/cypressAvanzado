Cypress.Commands.add('verifyBilling', (data) => {
    cy.get('.css-yz81d6').within(() => {
        Cypress._.forEach(data, (value, selector) => {
            cy.get(`[id="${selector}"]`).should('include.text', value)
        })
    })
})