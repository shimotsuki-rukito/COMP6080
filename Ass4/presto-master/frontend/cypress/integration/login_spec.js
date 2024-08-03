// frontend/cypress/integration/login_spec.js

describe('Login Page Tests', () => {
    beforeEach(() => {
      // Replace '/login' with the path to your actual login page
      cy.visit('http://localhost:3000/login');
    });
  
    it('redirects to dashboard if the user is already logged in', () => {
      // Assuming the token is stored in localStorage
      localStorage.setItem('token', 'your-fake-token');
      cy.visit('/login');
      cy.url().should('include', '/dashboard');
    });
  
    it('allows a user to log in', () => {
      cy.get('input[name="email"]').type('aa@aa.com');
      cy.get('input[name="password"]').type('aa');
      cy.get('form').submit();
      // Adjust this to check for something that happens as a result of a successful login
      cy.url().should('include', '/dashboard');
    });
  
    it('navigates to the registration page when the Register link is clicked', () => {
      cy.get('span').contains('Register').click();
      cy.url().should('include', '/register');
    });
  });
  