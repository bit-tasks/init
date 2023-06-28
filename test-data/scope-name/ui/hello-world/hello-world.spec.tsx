import React from 'react';
import { render } from '@testing-library/react';
import { BasicHelloWorld } from './hello-world.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicHelloWorld />);
  const rendered = getByText('Hello world!');
  expect(rendered).toBeTruthy();
});
