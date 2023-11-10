beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
    })

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Test suite for visual tests for registration form 3 is already created
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns
    * checkboxes, their content and links
    * email format
 */
describe('Section 1: Visual tests', () => {
    it('Check that radio button list is correct', () => {
    // Array of found elements with given selector has 4 elements in total
    cy.get('input[type="radio"]').should('have.length', 4)

    // Verify labels of the radio buttons
    cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
    cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
    cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
    cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')

    //Verify default state of radio buttons
    cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    cy.get('input[type="radio"]').eq(1).should('not.be.checked')
    cy.get('input[type="radio"]').eq(2).should('not.be.checked')
    cy.get('input[type="radio"]').eq(3).should('not.be.checked')

    // Selecting one will remove selection from other radio button
    cy.get('input[type="radio"]').eq(0).check().should('be.checked')
    cy.get('input[type="radio"]').eq(1).check().should('be.checked')
    cy.get('input[type="radio"]').eq(0).should('not.be.checked')
})

it('Check dropdown and dependencies between 2 dropdowns', () => {
    // Array of found elements with given selector has 4 elements in total
    
    cy.get('#country').select(2)
    cy.get('#city').select(1)

    // Check if the first dropdown contains 'Estonia'    
    cy.get('#country').contains('Estonia').should('exist')
    // Check if the second dropdown contains 'Tallinn'
    cy.get('#city').contains('Tallinn').should('exist')
})

it('Check checkboxes, their content and links', () => {
    // Check the first checkbox
    cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
    // Check the second checkbox
    cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')

    // Verify content associated with the first checkbox
    cy.contains('Accept our privacy policy').should('exist')
    // Verify content associated with the second checkbox
    cy.contains('Accept our cookie policy').should('exist')
    // Click the link associated with the second checkbox
    cy.contains('Accept our cookie policy').click()
    // Assert that the link redirects to the correct page (cookiePolicy.html in this case)
    cy.url().should('include', 'cookiePolicy.html')
})

it('Check email format', () => {
    // Get the email input field and type an invalid email address
    cy.get('input[name="email"]').type('invalidEmail').blur();

    // Verify that an error message is displayed for invalid email format
    cy.get('#emailAlert').should('be.visible');
    cy.get('#emailAlert').contains('Invalid email address.');
   
    // Clear the input field
    cy.get('input[name="email"]').clear();
   
    // Type a valid email address
    cy.get('input[name="email"]').type('valid.email@example.com').blur()
   
    // Verify that no error message is displayed for valid email format
    cy.get('#emailAlert').should('not.be.visible')
})
})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + validation
    * only mandatory fields are filled in + validations
    * mandatory fields are absent + validations (try using function)
    * If city is already chosen and country is updated, then city choice should be removed
    * add file (google yourself for solution)
 */

describe('Section 2: Functional tests', () => {
    it('All fields are filled in + validation', ()=>{
    
    //All fields are filled in + validation
    cy.get('#name').type('AlinaA')
    cy.get('[name="email"]').type('testing@email.com')
    cy.get('#country').select(2)
    cy.get('#city').select(1)
    
    cy.get('div label').contains('Date of birth').next('input[type="date"]').type('1998-11-02')
    cy.get('input[type="radio"]').eq(0).check().should('be.checked')
    cy.get('#birthday').type('1998-11-02')
    cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
    cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')

    cy.get('input[type=file]').selectFile('cypress/e2e/Alina_Aleksandrova_registration_form_2_test.cy.js')

    cy.get('input[type="submit"]').should('be.enabled')
    cy.get('input[type="submit"]').should('be.enabled').first().click()
})

it('Only mandatory fields are filled in + validations', ()=>{
    
    //Only mandatory fields are filled in + validations
    cy.get('#name').type('AlinaA')
    cy.get('[name="email"]').type('testing@email.com')
    cy.get('#country').select(2)
    
    cy.get('#birthday').type('1998-11-02')
    cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
    cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')

    cy.get('input[type="submit"]').should('be.enabled')
    cy.get('input[type="submit"]').should('be.enabled').first().click()
})

it('Mandatory fields are absent + validations', ()=>{
    
    //Mandatory fields are absent + validations (try using function)
    inputInvalidData()
    
    // Verify that the error message is displayed
    cy.get('#emailAlert').should('be.visible')

    cy.get('input[type="submit"]').should('be.enabled')
    cy.get('input[type="submit"]').should('be.enabled').first().click()
})

it('If city is already chosen and country is updated, then city choice should be removed', ()=>{
    
    //If city is already chosen and country is updated, then city choice should be removed
    cy.get('#country').select(2)
    cy.get('#city').select(1)

    cy.get('#country').select(1)

    cy.get('#city').should('not.be.checked')
})

it('Add file', ()=>{
    
    //Adding file

    cy.get('input[type=file]').selectFile('cypress/e2e/Alina_Aleksandrova_registration_form_2_test.cy.js')

    cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
    cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
})

})

function inputInvalidData() {
    cy.get('#name').type('...')
    cy.get('[name="email"]').type('invalidEmail')    
    cy.get('#birthday').type('3102-11-02')
  }