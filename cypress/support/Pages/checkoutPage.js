export class CheckoutPage {
    firstName(name) {
        return cy.get('[data-cy="firstName"]').type(name)
    }

    lastName(lastName) {
        return cy.get('[data-cy="lastName"]').type(lastName)
    }

    cardNumber(number) {
        return cy.get('[data-cy="cardNumber"]').type(number)
    }

    clickPurchase() {
        return cy.get('[data-cy="purchase"]').click()
    }

    getSelliD() {
        return cy.get('[data-cy="sellId"]')
    }

    getMoneySpent() {
    return    cy.get('[data-cy="totalPrice"]')
    }

    interceptPost() {
        return cy.intercept('POST', 'api/purchase', (res) => {
            res.status = 200
        })
    }

}