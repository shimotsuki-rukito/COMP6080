describe('Login Page Tests', () => {
    beforeEach(() => {
      cy.session('testUser', () => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[type="email"]').type('test@test.com');
        cy.get('input[id="password"]').type('test');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
      });
    });

    it('allows a user to log in', () => {
      cy.visit('http://localhost:3000/dashboard');
      cy.url().should('include', '/dashboard');
    });

    it('Creates a new presentation successfully', () => {
      cy.visit('http://localhost:3000/dashboard');
      cy.contains('button', 'New Presentation').click();
      cy.get('input[placeholder="Presentation Name"]')
          .type('Test Presentation 2');
      cy.get('textarea[placeholder="Description"]')
          .type('Test Description');
      cy.get('input[type="file"]').attachFile('Image_test.png');
      cy.get('button').contains('Create').click();
      cy.contains('Test Presentation 2').should('be.visible');
    });

    it('Add a textbox to a slide successfully', () => {
      cy.visit('http://localhost:3000/dashboard');
      cy.contains('Test Presentation 2').click();
      cy.get('button').contains('Textbox').click();
      cy.get('input[name="width"]').type('20');
      cy.get('input[name="height"]').type('20');
      cy.get('input[name="content"]').type('Test Textbox');
      cy.get('input[name="fontSize"]').type('2');
      cy.get('button').contains('Add textbox').click();
      cy.contains('Test Textbox').should('be.visible');
    });

    it('Edit a textbox successfully', () => {
      cy.visit('http://localhost:3000/dashboard');
      cy.contains('Test Presentation 2').click();
      cy.contains('Test Textbox').dblclick();
      cy.get('input[name="content"]').clear().type('Updated Test Textbox');
      cy.get('button').contains('Save Changes').click();
      cy.contains('Updated Test Textbox').should('be.visible');
    });

    it('Delete a textbox successfully', () => {
      cy.visit('http://localhost:3000/dashboard');
      cy.contains('Test Presentation 2').click();
      cy.contains('Updated Test Textbox').rightclick();
      cy.contains('Updated Test Textbox').should('not.exist');
    });

    it('Delete a presentation successfully', () => {
      cy.visit('http://localhost:3000/dashboard');
      cy.contains('Test Presentation 2').click();
      cy.on('window:confirm', (text) => {
        expect(text).to.contains('Are you sure?');
        return true;
      });
      cy.get('button').contains('Delete Presentation').click();
      cy.url().should('include', '/dashboard');
      cy.contains('Test Presentation 2').should('not.exist');
    });
  });
  