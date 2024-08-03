describe('Register and Create Presentation Tests', () => {
  before(() => {
    cy.visit('http://localhost:3000/register');
    cy.get('input[type="email"]').type('test@test.com');
    cy.get('input[id="password"]').type('test');
    cy.get('input[id="confirmPassword"]').type('test');
    cy.get('input[type="text"]').type('test');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('button').contains('Logout').click();
  });

  beforeEach(() => {
      cy.session('testUser', () => {
          cy.visit('http://localhost:3000/login');
          cy.get('input[type="email"]').type('test@test.com');
          cy.get('input[id="password"]').type('test');
          cy.get('button[type="submit"]').click();
          cy.url().should('include', '/dashboard');
      });
  });

  it('Registers successfully', () => {
    cy.visit('http://localhost:3000/dashboard');
    cy.url().should('include', '/dashboard');
  });

  it('Creates a new presentation successfully', () => {
    cy.visit('http://localhost:3000/dashboard');
    cy.contains('button', 'New Presentation').click();
    cy.get('input[placeholder="Presentation Name"]')
        .type('Test Presentation');
    cy.get('textarea[placeholder="Description"]')
        .type('Test Description');
    cy.get('input[type="file"]').attachFile('Image_test.png');
    cy.get('button').contains('Create').click();
    cy.contains('Test Presentation').should('be.visible');
  });

  it('Updates the thumbnail and name of the presentation successfully', () => {
    cy.visit('http://localhost:3000/dashboard');
    cy.contains('Test Presentation').click();
    cy.get('button').contains('Edit').click();
    cy.get('input[type="text"]').clear().type('Updated Test Presentation');
    cy.get('textarea').clear().type('Updated Test Description');
    cy.get('input[type="file"]').attachFile('Image_test2.png');
    cy.get('button').contains('Submit').click();
    cy.contains('Updated Test Presentation').should('be.visible');
  });

  it('Add some slides in a slideshow deck successfully', () => {
    cy.visit('http://localhost:3000/dashboard');
    cy.contains('Updated Test Presentation').click();
    cy.get('button').contains('Create Slide').click();
    cy.get('button').contains('Back').click();
    cy.contains('Number of slides: 2').should('be.visible');
  });

  it('Switch between slides successfully', () => {
    cy.visit('http://localhost:3000/dashboard');
    cy.contains('Updated Test Presentation').click();
    cy.get('img[alt="Next"]').first().click();
    cy.url().should('include', '/presentation/0/1');
    cy.get('img[alt="Previous"]').last().click();
    cy.url().should('include', '/presentation/0/0');
  });

  it('Delete a presentation successfully', () => {
    cy.visit('http://localhost:3000/dashboard');
    cy.contains('Updated Test Presentation').click();
    cy.on('window:confirm', (text) => {
      expect(text).to.contains('Are you sure?');
      return true;
    });
    cy.get('button').contains('Delete Presentation').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Test Presentation').should('not.exist');
  });

  it('Logs out of the application successfully', () => {
    cy.visit('http://localhost:3000/dashboard');
    cy.get('button').contains('Logout').click();
    cy.url().should('include', '/login');
  });

  it('Logs back into the application successfully', () => {
    cy.visit('http://localhost:3000/login');
    cy.url().should('include', '/dashboard');
  });
});
