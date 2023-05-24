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


test('moves left on click', () => {
 
  render(<AppFunctional initialIndex={5} />);

  const leftButton = screen.getByText(/LEFT/);
  userEvent.click(leftButton);

  const coordinatesElement = screen.getByTestId('coordinates');
  expect(coordinatesElement.textContent).toMatch(/\(2.*2\)$/)
});

test('increments steps after move', async () => {
  render(<AppFunctional initialIndex={5} />);
  
  const stepsElement = screen.getByText(/You moved 0 times/);
  expect(stepsElement).toBeInTheDocument();
  
  
  const leftButton = screen.getByText(/LEFT/);
  userEvent.click(leftButton);
  

  const stepsElementUpdated = await screen.findByText(/You moved 1 time/);
  expect(stepsElementUpdated).toBeInTheDocument();
});
test('renders the submit button', () => {
  render(<AppFunctional />);

  const submitButton = screen.getByRole('button', { name: /submit/i });
  expect(submitButton).toBeInTheDocument();
});
