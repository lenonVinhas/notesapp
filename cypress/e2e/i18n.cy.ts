describe('i18n Translations', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);
        cy.visit('/', {
            onBeforeLoad: (win) => {
                win.localStorage.setItem('notes-app-language', JSON.stringify('en'));
            }
        });
    });

    it('should load the app and show English text', () => {
        // Wait for potential render
        cy.wait(1000);

        // Debug: Check if main container exists
        cy.get('#root').should('exist');

        // Check for ANY English text
        cy.contains('Notes').should('exist');

        // Check specific key
        cy.contains('All notes').should('be.visible');

        // Switch to PT
        cy.get('button').contains(/^en$/i).click();
        cy.contains('Todas as notas').should('be.visible');
    });
});
