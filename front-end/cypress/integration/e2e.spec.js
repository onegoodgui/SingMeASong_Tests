


describe('e2e tests', () => {

  beforeEach(() => {
    cy.resetDB();
  });


  it('add a song', () => {


    cy.visit('http://localhost:3000');
  

    cy.get('input[placeholder="Name"]').type('Feed the Wolf');
    cy.get('input[placeholder="https://youtu.be/..."]').type('https://www.youtube.com/watch?v=UTuNRW8Zens');
    cy.get('button').click();


    cy.get('article').then(($article) => {
      expect($article).to.contain('Feed the Wolf');
    })

  })

  it('upvote a song', () => {
    cy.addSong('The Diary of Jane', 'https://www.youtube.com/watch?v=DWaB4PXCwFU');

    cy.visit('http://localhost:3000');

    cy.get('#upvote').click();

    cy.get('article').then(($article) => {
      expect($article).to.contain(1);
    })
  });

  it('most upvoted song appear first', () => {

    cy.visit('http://localhost:3000');
    cy.addSong('Psycho', 'https://www.youtube.com/watch?v=_Y_a0PWlBr8');
    cy.addSong('The Diary of Jane', 'https://www.youtube.com/watch?v=DWaB4PXCwFU');

    cy.get('article').contains('Psycho').parent().within(() => {
      cy.get('#upvote').click();
      cy.get('#upvote').click();
      cy.get('#upvote').click();
    })

    // cy.get('div').should('have.text', 'top');
    cy.get('#root>div>div').contains('Top').click();

    cy.get('article').first().then(($article) => {
      expect($article).to.contain('Psycho');
    })
  });

})

  