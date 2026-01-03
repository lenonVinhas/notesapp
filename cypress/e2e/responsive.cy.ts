describe('Responsive Layout', () => {
    it('should show 3-column layout on desktop', () => {
        cy.viewport(1280, 720); // Desktop
        cy.visit('/');

        // Sidebar visible
        cy.get('aside').should('be.visible');
        // Note list visible
        cy.contains(/Create New Note|Criar Nova Nota/i).should('be.visible');
        // Editor placeholder or empty state
        cy.contains(/Select a note|Selecione uma nota/i).should('be.visible');
    });

    it('should adapt to mobile layout', () => {
        cy.viewport('iphone-x');
        cy.visit('/');

        // Sidebar should be hidden initially
        cy.get('aside').should('not.be.visible'); // Or have class -translate-x-full

        // Menu button should be visible
        cy.get('button').find('svg.lucide-menu').should('exist'); // Menu icon

        // Open sidebar
        cy.get('button').find('svg.lucide-menu').parent().click();
        cy.get('aside').should('be.visible');

        // Close sidebar (click overlay or close button)
        cy.get('.fixed.inset-0').click({ force: true });
        cy.get('aside').should('not.be.visible');
    });

    it('should show mobile layout on large phones (500px)', () => {
        cy.viewport(500, 800);
        cy.visit('/');

        // Menu button should be visible (confirming mobile layout)
        cy.get('button').find('svg.lucide-menu').should('exist');

        // Open sidebar first
        cy.get('button').find('svg.lucide-menu').parent().click();

        // Opening settings should show mobile immersive view (h1 instead of h2 modal title)
        cy.get('a[aria-label="Settings"], a[aria-label="Configurações"]').first().click();
        cy.get('h1').contains(/Settings|Configurações/).should('be.visible');
    });
});
