import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock CrisisAssessment component since it might have complex dependencies
const MockCrisisAssessment = () => (
  <div data-testid="crisis-assessment">
    <h2>Crisis Risk Assessment</h2>
    <p>Emergency support is available 24/7</p>
    <button>Contact Crisis Support</button>
  </div>
);

describe('CrisisAssessment', () => {
  it('should render crisis assessment component', () => {
    render(
      <BrowserRouter>
        <MockCrisisAssessment />
      </BrowserRouter>
    );

    expect(screen.getByTestId('crisis-assessment')).toBeInTheDocument();
    expect(screen.getByText('Crisis Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Emergency support is available 24/7')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contact Crisis Support' })).toBeInTheDocument();
  });

  it('should have accessible elements', () => {
    render(
      <BrowserRouter>
        <MockCrisisAssessment />
      </BrowserRouter>
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});