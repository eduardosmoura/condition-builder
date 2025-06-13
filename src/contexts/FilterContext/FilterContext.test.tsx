import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, renderHook } from '@testing-library/react';

import { FilterProvider, useFilter, FilterContext } from './FilterContext';
import { CriteriaGroup } from '../../core/CriteriaGroup/CriteriaGroup';
import { Result } from 'types';
import { EMPTY_CRITERIA_GROUP, EMPTY_RESULT } from 'utils/constants';

vi.mock('../../core/CriteriaGroup/CriteriaGroup', () => ({
  CriteriaGroup: vi.fn().mockImplementation(() => ({}))
}));

describe('FilterContext', () => {
  describe('FilterProvider', () => {
    it('renders children without crashing', () => {
      render(
        <FilterProvider>
          <div data-testid="test-child">Test Child</div>
        </FilterProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('provides default values to context', () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useFilter();
        return <div>Test</div>;
      };

      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      expect(contextValue.result).toEqual(EMPTY_RESULT);
      expect(contextValue.criteriaGroup).toEqual(EMPTY_CRITERIA_GROUP);
      expect(contextValue.loading).toBe(false);
      expect(typeof contextValue.setResult).toBe('function');
      expect(typeof contextValue.setCriteriaGroup).toBe('function');
      expect(typeof contextValue.setLoading).toBe('function');
    });

    it('allows updating result state', () => {
      let contextValue: any;
      const newResult: Result = {
        data: [{ id: 1, name: 'Test' }],
        columns: ['id', 'name']
      };

      const TestComponent = () => {
        contextValue = useFilter();
        return (
          <button
            onClick={() => contextValue.setResult(newResult)}
            data-testid="update-result"
          >
            Update Result
          </button>
        );
      };

      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      expect(contextValue.result).toEqual(EMPTY_RESULT);

      act(() => {
        screen.getByTestId('update-result').click();
      });

      expect(contextValue.result).toEqual(newResult);
    });

    it('allows updating criteriaGroup state', () => {
      let contextValue: any;
      const newCriteriaGroup = new CriteriaGroup();

      const TestComponent = () => {
        contextValue = useFilter();
        return (
          <button
            onClick={() => contextValue.setCriteriaGroup(newCriteriaGroup)}
            data-testid="update-criteria-group"
          >
            Update Criteria Group
          </button>
        );
      };

      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      expect(contextValue.criteriaGroup).toEqual(EMPTY_CRITERIA_GROUP);

      act(() => {
        screen.getByTestId('update-criteria-group').click();
      });

      expect(contextValue.criteriaGroup).toEqual(newCriteriaGroup);
    });

    it('allows updating loading state', () => {
      let contextValue: any;

      const TestComponent = () => {
        contextValue = useFilter();
        return (
          <div>
            <div data-testid="loading-state">
              {contextValue.loading ? 'Loading' : 'Not Loading'}
            </div>
            <button
              onClick={() => contextValue.setLoading(true)}
              data-testid="set-loading-true"
            >
              Set Loading True
            </button>
            <button
              onClick={() => contextValue.setLoading(false)}
              data-testid="set-loading-false"
            >
              Set Loading False
            </button>
          </div>
        );
      };

      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      expect(screen.getByText('Not Loading')).toBeInTheDocument();

      act(() => {
        screen.getByTestId('set-loading-true').click();
      });

      expect(screen.getByText('Loading')).toBeInTheDocument();

      act(() => {
        screen.getByTestId('set-loading-false').click();
      });

      expect(screen.getByText('Not Loading')).toBeInTheDocument();
    });
  });

  describe('useFilter hook', () => {
    it('returns context value when used within FilterProvider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FilterProvider>{children}</FilterProvider>
      );

      const { result } = renderHook(() => useFilter(), { wrapper });

      expect(result.current.result).toEqual(EMPTY_RESULT);
      expect(result.current.criteriaGroup).toEqual(EMPTY_CRITERIA_GROUP);
      expect(result.current.loading).toBe(false);
      expect(typeof result.current.setResult).toBe('function');
      expect(typeof result.current.setCriteriaGroup).toBe('function');
      expect(typeof result.current.setLoading).toBe('function');
    });

    it('throws error when used outside FilterProvider', () => {
      const originalError = console.error;
      console.error = vi.fn();

      let hookError: string | null = null;

      const TestErrorComponent = () => {
        try {
          useFilter();
        } catch (error) {
          hookError = (error as Error).message;
        }
        return null;
      };

      render(<TestErrorComponent />);

      expect(hookError).toBe('useFilter must be used within a FilterProvider');

      console.error = originalError;
    });

    it('throws error when context value is undefined', () => {
      const originalError = console.error;
      console.error = vi.fn();

      let hookError: string | null = null;

      const TestErrorComponent = () => {
        try {
          useFilter();
        } catch (error) {
          hookError = (error as Error).message;
        }
        return null;
      };

      render(
        <FilterContext.Provider value={undefined}>
          <TestErrorComponent />
        </FilterContext.Provider>
      );

      expect(hookError).toBe('useFilter must be used within a FilterProvider');

      console.error = originalError;
    });
  });

  describe('state updates', () => {
    it('maintains independent state for multiple providers', () => {
      let contextValue1: any;
      let contextValue2: any;

      const TestComponent1 = () => {
        contextValue1 = useFilter();
        return <div>Test 1</div>;
      };

      const TestComponent2 = () => {
        contextValue2 = useFilter();
        return <div>Test 2</div>;
      };

      render(
        <div>
          <FilterProvider>
            <TestComponent1 />
          </FilterProvider>
          <FilterProvider>
            <TestComponent2 />
          </FilterProvider>
        </div>
      );

      expect(contextValue1.result).toEqual(EMPTY_RESULT);
      expect(contextValue2.result).toEqual(EMPTY_RESULT);
      expect(contextValue1).not.toBe(contextValue2);
    });

    it('updates state correctly with complex data', () => {
      let contextValue: any;
      const complexResult: Result = {
        data: [
          { id: 1, name: 'John', age: 30 },
          { id: 2, name: 'Jane', age: 25 }
        ],
        columns: ['id', 'name', 'age']
      };

      const TestComponent = () => {
        contextValue = useFilter();
        return (
          <button
            onClick={() => contextValue.setResult(complexResult)}
            data-testid="update-complex-result"
          >
            Update Complex Result
          </button>
        );
      };

      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      act(() => {
        screen.getByTestId('update-complex-result').click();
      });

      expect(contextValue.result).toEqual(complexResult);
      expect(contextValue.result.data).toHaveLength(2);
      expect(contextValue.result.columns).toHaveLength(3);
    });
  });
});
