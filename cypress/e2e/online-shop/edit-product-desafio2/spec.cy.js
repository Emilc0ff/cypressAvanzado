const directoryName = __dirname.replaceAll('\\', '/');
const module = directoryName.split('/')[2];
const suiteName = directoryName.slice(directoryName.lastIndexOf('/') + 1).split('-').slice(0, -1).join('-');
const suiteId = directoryName.split(/[-]/).pop();
import { HomePage } from '../../../support/Pages/homePage';
import { OnlineShopPage } from '../../../support/Pages/onlineShopPage';

before(() => {
    cy.login(Cypress.env().username, Cypress.env().password)
    cy.visit('')
});

describe(`${suiteName} - ${module}`, () => {
    const homePage = new HomePage;
    const onlineShopPage = new OnlineShopPage;
    it('', () => {
        cy.fixture(`${module}/${suiteName}-${suiteId}/${suiteId}.json`).then(data => {
            cy.request({
                method: "get",
                url: `${Cypress.env().baseUrlAPI}/products?id=${data.product.id}`,
                failonstatuscode: false,
                headers: {
                    Authorization: `Bearer ${Cypress.env().token}`
                }
            }).its('body.products.docs').each((product) => {
                cy.request({
                    method: "delete",
                    url: `${Cypress.env().baseUrlAPI}/product/${product._id}`,
                    headers: {
                        Authorization: `Bearer ${Cypress.env().token}`
                    }
                })
            })

            cy.request({
                method: "post",
                url: `${Cypress.env().baseUrlAPI}/create-product`,
                body: data.product,
                Authorization: `${Cypress.env().token}`
            }).its('body.product._id').as('idProduct')

            cy.then(function () {
                cy.request({
                    method: "PUT",
                    url: `${Cypress.env().baseUrlAPI}/product/${this.idProduct}`,
                    body: data.newProduct,
                    headers: {
                        Authorization: `Bearer ${Cypress.env().token}`
                    }
                })
            })

            homePage.clickOnlineShop()
            onlineShopPage.searchAsId()
            onlineShopPage.clickSearchInput(`${data.product.id}`);
            cy.wait(3000)
            onlineShopPage.getFirstProductImage().should('have.attr', 'src', `${data.newProduct.img}`)
            cy.getByDataCy(`name`).should('contain', `${data.newProduct.name}`)
            cy.getByDataCy(`price`).should('contain', `${data.newProduct.price}`)
        });
    });
});