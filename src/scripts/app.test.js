import roverApp from './app.js';

test('init app', () => {
  expect(roverApp.init()).toBe('init');
});