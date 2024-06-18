export class OnlineShopPage {
    constructor() {
        this.searchInput = 'input[placeholder="Search products"]'
        this.addProduct = '[data-cy="add-product"]'
        this.productName = 'input[data-cy="productName"]'
        this.productPrice = 'input[data-cy="productPrice"]'
        this.productCard = 'input[data-cy="productCard"]'
        this.productID = 'input[data-cy="productID"]'
        this.createProductButton = 'Create product'
        this.closeModalButton = 'button[data-cy="closeModal"]'
        this.searchType = 'select[data-cy="search-type"]'
        //this.deleteButton = 'button[aria-label="Delete"]'
        this.deleteModal = 'Delete'
        this.selectIdSearch = 'select[data-cy="search-type"]'
        
    }

    clickSearchInput(product) {
        cy.get(this.searchInput).click().clear().type(product).type('{enter}')
    }

    clickAddProduct() {
        cy.get(this.addProduct).click()
    }

    clickProductName(name) {
        cy.get(this.productName).click().type(name)
    }

    clickProductPrice(price) {
        cy.get(this.productPrice).click().type(price)
    }

    clickProductCard(card) {
        cy.get(this.productCard).click().type(card)
    }

    clickProductID(ID) {
        cy.get(this.productID).click().type(ID)
    }

    closeModal() {
        cy.get(this.closeModalButton).click()
    }

    clickCreateProduct() {
        cy.contains(this.createProductButton).click()
    }

    searchAsId() {
        cy.get(this.selectIdSearch).select("ID")
    }

    clickDeleteButtonModal() {
        cy.contains(this.deleteModal).click()
    }

    deleteProduct(id) {
        cy.get(`button[data-cy="delete-${id}`).click()
    }

    getItem(item) {
    return    cy.contains(item)
    }



}