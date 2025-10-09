import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders dental clinic app', () => {
  const { container } = render(<App />);
  expect(container).toBeTruthy();
});
