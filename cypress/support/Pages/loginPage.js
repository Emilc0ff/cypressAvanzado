export class LoginPage {
    constructor() {
        this.userInput = '[data-cy="user"]',
        this.passInput = '[data-cy="pass"]',
        this.loginButton = '[data-cy="submitForm"]'
    }

    escribirUsuario(usuario){
        cy.get(this.userInput).type(usuario)
    }

    escribirPass(pass) {
        cy.get(this.passInput).type(pass)
    }

    clickLoginButton() {
        cy.get(this.loginButton).click()
    }

}