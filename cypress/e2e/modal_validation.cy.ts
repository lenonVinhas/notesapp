describe('Modal Validation', () => {
    beforeEach(() => {
        cy.visit('/');
        // Clear storage and start fresh
        cy.clearLocalStorage();
    });

    it('should show the correct content in the Settings Modal', () => {
        cy.get('a[aria-label="Settings"], a[aria-label="Configurações"]').click();

        cy.get('[role="dialog"]').within(() => {
            cy.contains(/Settings|Configurações/i).should('be.visible');
            cy.contains(/Storage|Armazenamento/i).should('be.visible');
            cy.contains(/Browser Storage|Salvar no Navegador/i).should('be.visible');
            cy.contains(/Local Folder|Pasta Local/i).should('be.visible');
            cy.get('button').contains(/Close|Fechar/i).should('be.visible');
        });
    });

    it('should show the correct content in the Delete Note Modal', () => {
        // Create a note first
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();

        // Find the specific note title in the editor to be sure
        cy.get('input[placeholder="Note title"], input[placeholder="Título da nota"]').as('titleInput');
        cy.get('@titleInput').clear().type('Modal Test Note');

        // Click delete
        cy.get('button[aria-label="Delete note"], button[aria-label="Excluir nota"]').click();

        cy.get('[role="dialog"]').within(() => {
            cy.contains(/Delete note "Modal Test Note"|Excluir nota "Modal Test Note"/i).should('be.visible');
            cy.contains(/Are you sure you want to delete this note\?|Tem certeza que deseja excluir esta nota\?/i).should('be.visible');
            cy.get('button').contains(/Delete note|Excluir nota/i).should('be.visible');
            cy.get('button').contains(/Cancel|Cancelar/i).click();
        });

        cy.get('[role="dialog"]').should('not.exist');
    });

    it('should show the correct content in the Delete Tag Modal', () => {
        // Create a note
        cy.get('button').contains(/Create new note|Criar nova nota/i).click();

        // Add a tag (it's an input now, not a button click first)
        cy.get('input[placeholder*="tag"]').type('test-tag{enter}');

        // Go to sidebar tags list and click delete
        // We need to wait for the tag to appear in the sidebar
        cy.contains('test-tag').should('be.visible');

        // Find the tag item in the sidebar and click the delete button
        // The tag list in Sidebar uses SidebarTagList -> useTagItem
        cy.get('aside').contains('test-tag').parent().find('button[aria-label*="Delete"], button[aria-label*="Excluir"]').click();

        cy.get('[role="dialog"]').within(() => {
            cy.contains(/Delete tag "test-tag"|Excluir tag "test-tag"/i).should('be.visible');
            cy.contains(/Are you sure you want to delete this tag\?|Tem certeza que deseja excluir esta tag\?/i).should('be.visible');
            // Check for notes affected message (since we just added it to one note)
            cy.contains(/1 note|1 nota/i).should('be.visible');
            cy.get('button').contains(/Delete tag|Excluir tag/i).should('be.visible');
            cy.get('button').contains(/Cancel|Cancelar/i).click();
        });
    });
});
