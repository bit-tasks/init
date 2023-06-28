import { getHelloWorld } from './get-hello-world';

it('should return the correct value', () => {
  expect(getHelloWorld()).toBe('Hello world!');
});
