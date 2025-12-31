describe('Search Functionality', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.clearLocalStorage();
        cy.reload();
    });

    it('should search for notes', () => {
        // Create notes
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]').type('Apple Pie Recipe');
        cy.get('textarea[placeholder="Start writing..."], textarea[placeholder="Comece a escrever..."]').type('Ingredients: apples, sugar.');

        cy.get('button').contains(/Create new note|Criar nova nota/i).click();
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]').type('Meeting Notes');
        cy.get('textarea[placeholder="Start writing..."], textarea[placeholder="Comece a escrever..."]').type('Discuss budget.');

        // Go to list
        cy.contains(/All notes|Todas as notas/i).click();

        // Search for 'Apple'
        cy.get('input[placeholder*="Search" i], input[placeholder*="Pesquisar" i]').type('Apple');

        // Verify results
        cy.contains('Apple Pie Recipe').should('be.visible');
        cy.contains('Meeting Notes').should('not.exist');

        // Clear search
        cy.get('input[placeholder*="Search" i], input[placeholder*="Pesquisar" i]').clear();
        cy.contains('Meeting Notes').should('be.visible');
    });

    it('should show no results message', () => {
        cy.get('input[placeholder*="Search" i], input[placeholder*="Pesquisar" i]').type('NonExistentTerm');
        cy.contains(/No results found|Nenhum resultado encontrado/i).should('be.visible');
    });
});
