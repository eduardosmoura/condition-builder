import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, renderHook, waitFor } from '@testing-library/react';

import { NotificationProvider, useNotification } from './NotificationContext';

describe('NotificationContext', () => {
  describe('NotificationProvider', () => {
    it('renders children without crashing', () => {
      render(
        <NotificationProvider>
          <div data-testid="test-child">Test Child</div>
        </NotificationProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('provides context functions to children', () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useNotification();
        return <div>Test</div>;
      };

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      expect(typeof contextValue.showNotification).toBe('function');
      expect(typeof contextValue.showError).toBe('function');
      expect(typeof contextValue.showWarning).toBe('function');
      expect(typeof contextValue.showSuccess).toBe('function');
      expect(typeof contextValue.showInfo).toBe('function');
    });

    it('shows notification with default severity (info)', () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useNotification();
        return (
          <button
            onClick={() => contextValue.showNotification('Test message')}
            data-testid="show-notification"
          >
            Show Notification
          </button>
        );
      };

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      act(() => {
        screen.getByTestId('show-notification').click();
      });

      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows notification with custom severity', () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useNotification();
        return (
          <button
            onClick={() =>
              contextValue.showNotification('Test error message', 'error')
            }
            data-testid="show-error-notification"
          >
            Show Error Notification
          </button>
        );
      };

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      act(() => {
        screen.getByTestId('show-error-notification').click();
      });

      expect(screen.getByText('Test error message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows error notification', () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useNotification();
        return (
          <button
            onClick={() => contextValue.showError('Error message')}
            data-testid="show-error"
          >
            Show Error
          </button>
        );
      };

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      act(() => {
        screen.getByTestId('show-error').click();
      });

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows warning notification', () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useNotification();
        return (
          <button
            onClick={() => contextValue.showWarning('Warning message')}
            data-testid="show-warning"
          >
            Show Warning
          </button>
        );
      };

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      act(() => {
        screen.getByTestId('show-warning').click();
      });

      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows success notification', () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useNotification();
        return (
          <button
            onClick={() => contextValue.showSuccess('Success message')}
            data-testid="show-success"
          >
            Show Success
          </button>
        );
      };

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      act(() => {
        screen.getByTestId('show-success').click();
      });

      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows info notification', () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useNotification();
        return (
          <button
            onClick={() => contextValue.showInfo('Info message')}
            data-testid="show-info"
          >
            Show Info
          </button>
        );
      };

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      act(() => {
        screen.getByTestId('show-info').click();
      });

      expect(screen.getByText('Info message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('closes notification when close button is clicked', async () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useNotification();
        return (
          <button
            onClick={() => contextValue.showInfo('Closable message')}
            data-testid="show-closable"
          >
            Show Closable
          </button>
        );
      };

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      act(() => {
        screen.getByTestId('show-closable').click();
      });

      expect(screen.getByText('Closable message')).toBeInTheDocument();

      const closeButton = screen.getByLabelText('Close');
      act(() => {
        closeButton.click();
      });

      await waitFor(() => {
        expect(screen.queryByText('Closable message')).not.toBeInTheDocument();
      });
    });

    it('displays only the most recent notification', () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useNotification();
        return (
          <div>
            <button
              onClick={() => contextValue.showInfo('First message')}
              data-testid="show-first"
            >
              Show First
            </button>
            <button
              onClick={() => contextValue.showError('Second message')}
              data-testid="show-second"
            >
              Show Second
            </button>
          </div>
        );
      };

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      act(() => {
        screen.getByTestId('show-first').click();
      });

      expect(screen.getByText('First message')).toBeInTheDocument();

      act(() => {
        screen.getByTestId('show-second').click();
      });

      expect(screen.queryByText('First message')).not.toBeInTheDocument();
      expect(screen.getByText('Second message')).toBeInTheDocument();
    });
  });

  describe('useNotification hook', () => {
    it('returns context value when used within NotificationProvider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <NotificationProvider>{children}</NotificationProvider>
      );

      const { result } = renderHook(() => useNotification(), { wrapper });

      expect(typeof result.current.showNotification).toBe('function');
      expect(typeof result.current.showError).toBe('function');
      expect(typeof result.current.showWarning).toBe('function');
      expect(typeof result.current.showSuccess).toBe('function');
      expect(typeof result.current.showInfo).toBe('function');
    });

    it('throws error when used outside NotificationProvider', () => {
      const originalError = console.error;
      console.error = vi.fn();

      let hookError: string | null = null;

      const TestErrorComponent = () => {
        try {
          useNotification();
        } catch (error) {
          hookError = (error as Error).message;
        }
        return null;
      };

      render(<TestErrorComponent />);

      expect(hookError).toBe(
        'useNotification must be used within a NotificationProvider'
      );

      console.error = originalError;
    });
  });
});
