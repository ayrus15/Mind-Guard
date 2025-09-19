describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear local storage before each test
    cy.clearLocalStorage()
  })

  it('should display the home page', () => {
    cy.visit('/')
    cy.contains('MindGuard AI')
    cy.contains('Welcome to MindGuard AI')
  })

  it('should navigate to login page', () => {
    cy.visit('/')
    cy.get('[data-testid="login-link"]').click()
    cy.url().should('include', '/login')
    cy.contains('Sign In')
  })

  it('should navigate to register page', () => {
    cy.visit('/')
    cy.get('[data-testid="register-link"]').click()
    cy.url().should('include', '/register')
    cy.contains('Create Account')
  })

  it('should show validation errors for invalid login', () => {
    cy.visit('/login')
    cy.get('[data-testid="login-button"]').click()
    
    // Should show validation errors
    cy.contains('Email is required')
    cy.contains('Password is required')
  })

  it('should show validation errors for invalid registration', () => {
    cy.visit('/register')
    cy.get('[data-testid="register-button"]').click()
    
    // Should show validation errors
    cy.contains('Name is required')
    cy.contains('Email is required')
    cy.contains('Password is required')
  })

  it('should handle failed login attempt', () => {
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('invalid@example.com')
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()
    
    // Should show error message
    cy.contains('Invalid credentials')
  })
})