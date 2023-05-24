// Write your tests here
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import AppFunctional from './AppFunctional';
test('sanity', () => {
  expect(true).toBe(true)
})

test('renders without errors', () => {
  render(<AppFunctional />);

});


test('displays heading', () => {
  const { getByTestId } = render(<AppFunctional />);
  const coordinatesElement = getByTestId('coordinates')
  expect(coordinatesElement).toBeInTheDocument();
   expect(coordinatesElement).toBeTruthy();
   
   expect(coordinatesElement.textContent).toMatch(/\(2.*2\)$/)
});
