export class BillingPage {
    goToCheckout() {
        return cy.get('[data-cy="goCheckout"]').click()
    }
}