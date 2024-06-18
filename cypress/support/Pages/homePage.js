export class HomePage {
    constructor() {
        this.onlineShop = '[data-cy="onlineshoplink"]'
    }

    clickOnlineShop() {
        cy.get(this.onlineShop).click()
    }
}