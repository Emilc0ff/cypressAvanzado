const directoryName = __dirname.replaceAll('\\','/');
const module = directoryName.split('/')[2];
const suiteName = directoryName.slice(directoryName.lastIndexOf('/') + 1).split('-').slice(0, -1).join('-');
const suiteId = directoryName.split(/[-]/).pop();
let data;
const idRandom = Math.floor(Math.random() * 9999 );
import { RegistrationPage } from '../../../support/Pages/registrationPage';
import { LoginPage } from '../../../support/Pages/loginPage';
import { HomePage } from '../../../support/Pages/homePage';
import { OnlineShopPage } from '../../../support/Pages/onlineShopPage';

describe(`${suiteName} - ${module}`, () => {
  const registrationPage = new RegistrationPage;
  const loginPage = new LoginPage;
  const homePage = new HomePage;
  const onlineShopPage = new OnlineShopPage;

  before(() => {
    cy.fixture(`${module}/${suiteName}-${suiteId}/${suiteId}.json`).then(varData => {
      data = varData
      data.productInfo.id = idRandom
    });
  });
  
  beforeEach(() => {
    cy.visit('')
    registrationPage.clickLogButton()
  });

  it('Deberia crear un producto, buscarlo, borrarlo, y verificar que no existe mas', () => {
    loginPage.escribirUsuario(data.userInfo.name);
    loginPage.escribirPass(data.userInfo.password);
    loginPage.clickLoginButton();
    homePage.clickOnlineShop();
    onlineShopPage.clickAddProduct();
    onlineShopPage.clickProductName(data.productInfo.name);
    onlineShopPage.clickProductPrice(data.productInfo.price);
    onlineShopPage.clickProductCard(data.productInfo.img);
    onlineShopPage.clickProductID(data.productInfo.id);
    onlineShopPage.clickCreateProduct();
    cy.wait(4000);
    onlineShopPage.closeModal();
    onlineShopPage.searchAsId();
    cy.wait(2000);
    onlineShopPage.clickSearchInput(data.productInfo.id);
    cy.wait(2000);
    onlineShopPage.deleteProduct(data.productInfo.id);
    onlineShopPage.clickDeleteButtonModal();
    onlineShopPage.closeModal();
    onlineShopPage.clickSearchInput(data.productInfo.id);
    onlineShopPage.getItem(data.productInfo.name).should('not.exist');
  })
})