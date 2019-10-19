import { getGreeting } from '../support/app.po';

describe('market-monitor', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to market-monitor!');
  });
});
