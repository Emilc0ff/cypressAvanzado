export class ShoppingCartPage {
    goToBilling() {
        cy.get('[data-cy="goBillingSummary"]').click()
    }

    showTotalPrice() {
        return cy.contains('Show total price').click()
    }

    getTotalPrice() {
        return cy.get('p[id=price]')
    }

}