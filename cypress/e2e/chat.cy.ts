describe('Chat Functionality', () => {
  beforeEach(() => {
    // Mock login for chat tests
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token')
      win.localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }))
    })
  })

  it('should display chat interface', () => {
    cy.visit('/chat')
    cy.contains('AI Chat Assistant')
    cy.get('[data-testid="chat-input"]').should('be.visible')
    cy.get('[data-testid="send-button"]').should('be.visible')
  })

  it('should allow sending messages', () => {
    cy.visit('/chat')
    
    const testMessage = 'Hello, how are you?'
    cy.get('[data-testid="chat-input"]').type(testMessage)
    cy.get('[data-testid="send-button"]').click()
    
    // Should show the sent message
    cy.contains(testMessage)
    
    // Input should be cleared
    cy.get('[data-testid="chat-input"]').should('have.value', '')
  })

  it('should show typing indicator', () => {
    cy.visit('/chat')
    
    cy.get('[data-testid="chat-input"]').type('Hello')
    cy.get('[data-testid="send-button"]').click()
    
    // Should show typing indicator
    cy.contains('AI is typing...')
  })

  it('should display chat history', () => {
    cy.visit('/chat')
    
    // Send multiple messages
    const messages = ['Hello', 'How are you?', 'Tell me about CBT']
    
    messages.forEach((message, index) => {
      cy.get('[data-testid="chat-input"]').type(message)
      cy.get('[data-testid="send-button"]').click()
      cy.wait(1000) // Wait between messages
    })
    
    // All messages should be visible
    messages.forEach(message => {
      cy.contains(message)
    })
  })
})