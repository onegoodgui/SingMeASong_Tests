// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
Cypress.Commands.add("resetDB", () => {
	cy.request("POST", "http://localhost:5000/tests/reset", {});
});

Cypress.Commands.add("addSong", (name, youtubeLink) => {
	cy.request("POST", "http://localhost:5000/tests", {name, youtubeLink});
});
