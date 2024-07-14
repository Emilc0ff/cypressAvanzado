export class ShoppingCartPage {
    goToBilling() {
        cy.get('[data-cy="goBillingSummary"]').click()
    }
}