import Config from '../src/components/Config';

test('Config values are correct', () => {
  expect(Config.appTitle).toBe('Coco Nutrition');
  expect(Config.versionNumber).toBe('1.0.0.0');
  expect(Config.privacyPolicy).toBe('https://groups.csail.mit.edu/sls/coco-privacy-policy/');
  expect(Config.termsOfService).toBe('https://enshrouded-tech.com/tos/');
});
