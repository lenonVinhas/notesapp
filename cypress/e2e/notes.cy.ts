describe('Notes Management', () => {
    beforeEach(() => {
        cy.visit('/');
        // Clean up storage before each test to have a fresh state
        cy.clearLocalStorage();
        cy.reload();
    });

    it('should create a new note', () => {
        // Check if initial state is empty or has default
        cy.contains(/NotesApp/i).should('be.visible');

        // Click create button
        // The button has specific styles, we can target by text
        // Assuming 'New Note' or translation. We try to find the button with Plus icon or text
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();

        // Verify a new note appears in the list
        // The placeholder is "Note title" or "Título da nota"
        cy.get('button').contains(/Note title|Título da nota/i).should('be.visible');

        // Verify editor is active
        cy.get('input[placeholder="Note title"]').should('be.visible');
    });

    it('should edit a note', () => {
        // Create a note first
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();

        const title = 'My Test Note';
        const content = 'This is the content of the test note.';

        // Type title
        // Use regex for placeholder to support both languages if needed, or just partial match
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]')
            .clear()
            .type(title)
            .should('have.value', title);

        // Type content
        cy.get('textarea[placeholder="Start writing..."], textarea[placeholder="Comece a escrever..."]')
            .type(content)
            .should('have.value', content);

        // Verify list updates
        cy.contains(title).should('be.visible');
    });

    it('should delete a note', () => {
        // Create a note
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]').type('Note to Delete');

        // Click delete button (trash icon)
        // We need to identify the delete button in NoteEditor
        // We can rely on title attribute which is usually translated
        cy.get('button[title*="Delete"], button[title*="Excluir"]').click();

        // Confirm deletion in modal
        cy.contains(/Delete note|Excluir nota/i).should('be.visible'); // Modal title or text
        // Click confirm button (usually red)
        cy.get('button.bg-red-600').contains(/Delete|Excluir/i).click();

        // Verify note is gone
        cy.contains('Note to Delete').should('not.exist');
    });
});
