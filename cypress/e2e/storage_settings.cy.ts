describe('Settings and Storage', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/');
    });

    it('should open and close the settings modal', () => {
        // Open settings using accessible label
        cy.get('a[aria-label="Settings"], a[aria-label="Configurações"]').first().click();

        // Modal header
        cy.get('h2').contains(/Settings|Configurações/).should('be.visible');

        // Close with aria-label
        cy.get('button[aria-label="Cancel"], button[aria-label="Cancelar"]').first().click();
        cy.get('h2').contains(/Settings|Configurações/).should('not.exist');
    });

    it('should show storage options and allow interacting with local folder', () => {
        cy.get('a[aria-label="Settings"], a[aria-label="Configurações"]').first().click();

        // Check if options are visible (using partial text or regex)
        cy.get('p').contains(/Browser Storage|Salvar no Navegador/).should('be.visible');
        cy.get('p').contains(/Local Folder|Pasta Local/).should('be.visible');

        // Toggle switch or Choose button should exist
        cy.get('button').contains(/Use Local Folder|Usar Pasta Local/).should('exist');
    });
});
