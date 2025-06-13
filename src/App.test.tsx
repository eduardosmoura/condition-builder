import { render, screen } from '@testing-library/react';
import App from './App';

describe('<App />', () => {
  describe('when the application is first rendered', () => {
    beforeEach(() => {
      render(<App />);
    });

    it('should display a loading indicator', () => {
      expect(screen.getByText(/Condition Builder/i)).toBeInTheDocument();
    });
  });
});
