export class RegistrationPage {
    constructor() {
        this.loginButton = '[data-cy="registertoggle"]'
    }

    clickLogButton() {
        cy.get(this.loginButton).dblclick()
    }
}