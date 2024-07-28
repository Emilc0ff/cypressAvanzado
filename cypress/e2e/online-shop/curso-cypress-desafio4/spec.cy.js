const directoryName = __dirname.replaceAll('\\', '/');
const module = directoryName.split('/')[2];
const suiteName = directoryName.slice(directoryName.lastIndexOf('/') + 1).split('-').slice(0, -1).join('-');
const suiteId = directoryName.split(/[-]/).pop();
import { HomePage } from '../../../support/Pages/homePage';
import { OnlineShopPage } from '../../../support/Pages/onlineShopPage';
import { ShoppingCartPage } from '../../../support/Pages/shoppingCartPage';
import { BillingPage } from '../../../support/Pages/billingPage';
import { CheckoutPage } from '../../../support/Pages/checkoutPage';


before(() => {
    cy.login(Cypress.env().username, Cypress.env().password)
    cy.visit('')
});

describe(`${suiteName} - ${module}`, () => {
    const homepage = new HomePage
    const onlineShopPage = new OnlineShopPage
    const shoppingCartPage = new ShoppingCartPage
    const billingPage = new BillingPage
    const checkoutPage = new CheckoutPage

    it('Desafio final', () => {
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
                method: "get",
                url: `${Cypress.env().baseUrlAPI}/products?id=${data.product2.id}`,
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
            })

            cy.request({
                method: "post",
                url: `${Cypress.env().baseUrlAPI}/create-product`,
                body: data.product2,
                Authorization: `${Cypress.env().token}`
            })

            homepage.clickOnlineShop()
            onlineShopPage.searchAsId()
            onlineShopPage.clickSearchInput(`${data.product.id}`);
            onlineShopPage.addToCart(data.product.id);
            onlineShopPage.closeModal();
            onlineShopPage.addToCart(data.product.id);
            onlineShopPage.closeModal();
            onlineShopPage.clickSearchInput(`${data.product2.id}`);
            onlineShopPage.addToCart(data.product2.id);
            onlineShopPage.closeModal();
            onlineShopPage.addToCart(data.product2.id);
            onlineShopPage.closeModal();
            onlineShopPage.goToShoppingCart();
            cy.getByDataCy('productAmount').eq(0).should('have.text', 2)
            cy.getByDataCy('productName').eq(0).should('have.text', data.product.name)
            cy.getByDataCy('unitPrice').eq(0).should('have.text', `$${data.product.price}`)
            cy.getByDataCy('totalPrice').eq(0).should('have.text', `$${data.product.price * 2}`)
            cy.getByDataCy('productAmount').eq(1).should('have.text', 2)
            cy.getByDataCy('productName').eq(1).should('have.text', data.product2.name)
            cy.getByDataCy('unitPrice').eq(1).should('have.text', `$${data.product2.price}`)
            cy.getByDataCy('totalPrice').eq(1).should('have.text', `$${data.product2.price * 2}`)
            const expectedOrderPrice = (data.product.price * 2) + (data.product2.price * 2)
            shoppingCartPage.showTotalPrice()
            shoppingCartPage.getTotalPrice().invoke('text').as('actualOrderPrice')
            cy.then(function () {
                expect(this.actualOrderPrice).to.be.eq(`${expectedOrderPrice}.00`)
                shoppingCartPage.goToBilling()
                cy.verifyBilling({
                    "subtotalAmount": `${expectedOrderPrice}`,
                    "freightAmount": "Free",
                    "totalPriceAmount": `${expectedOrderPrice}`
                })  
            })
            billingPage.goToCheckout()
            checkoutPage.firstName(data.customer.name)
            checkoutPage.lastName(data.customer.lastname)
            checkoutPage.cardNumber(data.customer.cardnumber)
            checkoutPage.clickPurchase()
            checkoutPage.interceptPost()
            checkoutPage.getSelliD().invoke('text').as('sellId');
            checkoutPage.getMoneySpent().invoke('text').as('moneySpent');
            checkoutPage.interceptPost();
            cy.then(function () {
                const totalMoney = parseInt(this.moneySpent.split('$')[1])
                const getSellQuery =
                    `SELECT p.product, p.quantity, p.total_price, s."firstName", s."lastName", s."cardNumber" 
                FROM public."purchaseProducts" p
                INNER JOIN public.sells s on s.id = p.sell_id
                WHERE s.id = ${this.sellId}`
                cy.task("connectDB", getSellQuery).then(response => {
                    expect(response[0].cardNumber).to.be.eq(data.customer.cardnumber);
                    expect(response[0].firstName).to.be.eq(data.customer.name);
                    expect(response[0].lastName).to.be.eq(data.customer.lastname);
                    expect(response[0].product).to.be.eq(data.product.name);
                    expect(response[0].total_price).to.be.eq(`${data.product.price * response[0].quantity}.00`);
                    expect(response[1].cardNumber).to.be.eq(data.customer.cardnumber);
                    expect(response[1].firstName).to.be.eq(data.customer.name);
                    expect(response[1].lastName).to.be.eq(data.customer.lastname);
                    expect(response[1].product).to.be.eq(data.product2.name);
                    expect(response[1].total_price).to.be.eq(`${data.product2.price * response[1].quantity}.00`);
                    const totalSum = (data.product.price * response[0].quantity) + (data.product2.price * response[1].quantity);
                    expect(totalMoney).to.be.eq(totalSum);
                })
            })
        });
    });
})