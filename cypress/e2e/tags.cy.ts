describe('Tags Management', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.clearLocalStorage();
        cy.reload();
    });

    it('should add a tag to a note', () => {
        // Create note
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]').type('Note with Tag');
        cy.get('textarea[placeholder="Start writing..."], textarea[placeholder="Comece a escrever..."]').type('Content');

        // Add tag
        // Placeholder is "+ tag" in both languages
        cy.get('form input[placeholder*="+ tag"]').type('important{enter}');

        // Verify tag appears in note editor
        cy.get('span').contains('important').should('be.visible');

        // Verify tag appears in Sidebar (might need refresh or wait, but React state should update)
        cy.get('aside').contains('important').should('be.visible');
    });

    it('should filter notes by tag', () => {
        // Create first note with tag
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]').type('Note 1');
        cy.get('form input[placeholder*="+ tag"]').type('work{enter}');

        // Create second note without tag (or different tag)
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]').type('Note 2');

        // Click 'All Notes' to see list
        cy.contains(/All notes|Todas as notas/i).click();

        // Verify both notes are visible
        cy.contains('Note 1').should('be.visible');
        cy.contains('Note 2').should('be.visible');

        // Click 'work' tag in sidebar
        cy.get('aside').contains('work').click();

        // Verify only Note 1 is visible
        cy.contains('Note 1').should('be.visible');
        cy.contains('Note 2').should('not.exist');
    });

    it('should show autocomplete suggestions', () => {
        // Create first note with a distinct tag
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]').type('Original Tagged Note');
        cy.get('form input[placeholder*="+ tag"]').type('UniqueTag{enter}');

        // Create second note
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]').type('New Note for Autocomplete');

        // Type partial tag
        cy.get('form input[placeholder*="+ tag"]').type('Unique');

        // Verify suggestion appears (class check or text check)
        cy.contains('button', 'UniqueTag').should('be.visible');

        // Click suggestion
        cy.contains('button', 'UniqueTag').click();

        // Verify tag is added
        cy.get('span').contains('UniqueTag').should('be.visible');
    });

    it('should rename a tag', () => {
        // Create note and tag
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]').type('Note for Rename');
        cy.get('form input[placeholder*="+ tag"]').type('OldName{enter}');

        // Find tag in sidebar and rename
        // Force click the edit button (which might be hidden until hover)
        cy.get('button[aria-label="Edit tag"], button[aria-label="Editar tag"]').last().click({ force: true });

        // Input should appear
        cy.get('input[value="OldName"]').clear().type('NewName{enter}');

        // Verify change in sidebar
        cy.get('aside').contains('NewName').should('be.visible');
        cy.get('aside').contains('OldName').should('not.exist');

        // Verify change in note
        cy.get('span').contains('NewName').should('be.visible');
    });
});
