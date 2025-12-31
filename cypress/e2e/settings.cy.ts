describe('Settings and Internationalization', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.clearLocalStorage();
    });

    it('should switch language', () => {
        // Check initial language (assuming EN or PT, checking toggle button)
        // Find the globe icon button
        cy.get('button[title="Switch Language"]').click();

        // Verify language change
        // If it was EN, it should become PT, or vice-versa
        // We check for a specific text change
        cy.get('body').then(($body) => {
            if ($body.text().includes('Create new note')) {
                // It is now EN
                // Switch to PT
                cy.get('button[title="Switch Language"]').click();
                cy.contains('Criar nova nota').should('be.visible');
            } else {
                // It is PT
                cy.contains('Criar nova nota').should('be.visible');
                // Switch to EN
                cy.get('button[title="Switch Language"]').click();
                cy.contains('Create new note').should('be.visible');
            }
        });
    });
});
