/* eslint-disable func-names */

describe("My First Test", function() {
  it("Visits the Kitchen Sink", function() {
    cy.visit("http://localhost:3000");
    cy.contains("Hello, world!");
  });
});
