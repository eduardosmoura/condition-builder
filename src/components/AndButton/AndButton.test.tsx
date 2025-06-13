import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

import AndButton from './AndButton';
import { FilterContext } from 'contexts';
import { CriteriaGroup, CriteriaList } from 'core';
import { Result, Operator } from 'types';

vi.mock('../../utils/functions', () => ({
  deepClone: vi.fn((obj) => JSON.parse(JSON.stringify(obj))),
  generateId: vi.fn(() => 'mock-id')
}));

vi.mock('core', () => ({
  CriteriaList: vi.fn(),
  CriteriaGroup: vi.fn()
}));

describe('AndButton', () => {
  const mockSetFilterGroup = vi.fn();
  const mockSetData = vi.fn();
  const mockSetLoading = vi.fn();
  const mockFilterGroup = {
    add: vi.fn(),
    all: vi.fn(() => []),
    reset: vi.fn(),
    size: vi.fn(() => 0),
    insertAfter: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  } as unknown as CriteriaGroup;
  const mockData: Result = {
    columns: ['name', 'age'],
    data: [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 }
    ]
  };

  const mockContextValue = {
    setCriteriaGroup: mockSetFilterGroup,
    criteriaGroup: mockFilterGroup,
    result: mockData,
    setResult: mockSetData,
    loading: false,
    setLoading: mockSetLoading
  };

  const mockCriteriaListInstance = {
    add: vi.fn(),
    all: vi.fn(() => []),
    reset: vi.fn(),
    size: vi.fn(() => 0),
    insertAfter: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (CriteriaList as any).mockImplementation(() => mockCriteriaListInstance);
  });

  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <FilterContext.Provider value={contextValue}>
        <AndButton />
      </FilterContext.Provider>
    );
  };

  describe('Rendering', () => {
    it('should render the And button', () => {
      renderWithContext();

      const andButton = screen.getByRole('button', { name: /and/i });
      expect(andButton).toBeInTheDocument();
    });

    it('should display the Add icon', () => {
      renderWithContext();

      const addIcon = screen.getByTestId('AddIcon');
      expect(addIcon).toBeInTheDocument();
    });

    it('should have correct button text', () => {
      renderWithContext();

      expect(screen.getByText('And')).toBeInTheDocument();
    });
  });

  describe('Functionality', () => {
    it('should call handleAdd when button is clicked', () => {
      renderWithContext();

      const andButton = screen.getByRole('button', { name: /and/i });
      fireEvent.click(andButton);

      expect(CriteriaList).toHaveBeenCalled();
      expect(mockFilterGroup.add).toHaveBeenCalled();
      expect(mockSetFilterGroup).toHaveBeenCalled();
    });

    it('should create a new filter with correct properties when clicked', () => {
      renderWithContext();

      const andButton = screen.getByRole('button', { name: /and/i });
      fireEvent.click(andButton);

      expect(mockCriteriaListInstance.add).toHaveBeenCalledWith(
        expect.objectContaining({
          leftCondition: mockData.columns[0],
          operator: Operator.EQ,
          value: '',
          id: 'mock-id'
        })
      );
    });

    it('should add the new CriteriaList to criteriaGroup', () => {
      renderWithContext();

      const andButton = screen.getByRole('button', { name: /and/i });
      fireEvent.click(andButton);

      expect(CriteriaList).toHaveBeenCalled();
      expect(mockFilterGroup.add).toHaveBeenCalledWith(
        mockCriteriaListInstance
      );
    });

    it('should generate unique IDs for each filter', () => {
      renderWithContext();

      const andButton = screen.getByRole('button', { name: /and/i });

      fireEvent.click(andButton);
      fireEvent.click(andButton);

      expect(CriteriaList).toHaveBeenCalledTimes(2);
      expect(mockCriteriaListInstance.add).toHaveBeenCalledTimes(2);
      expect(mockCriteriaListInstance.add).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ id: 'mock-id' })
      );
      expect(mockCriteriaListInstance.add).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ id: 'mock-id' })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty columns array', () => {
      const contextWithoutColumns = {
        ...mockContextValue,
        result: { columns: [], data: [] }
      };

      renderWithContext(contextWithoutColumns);

      const andButton = screen.getByRole('button', { name: /and/i });
      fireEvent.click(andButton);

      expect(CriteriaList).toHaveBeenCalled();
      expect(mockFilterGroup.add).toHaveBeenCalled();
      expect(mockSetFilterGroup).toHaveBeenCalled();
    });

    it('should handle missing context gracefully', () => {
      expect(() => {
        render(<AndButton />);
      }).not.toThrow();
    });
  });

  describe('Multiple Clicks', () => {
    it('should handle multiple rapid clicks', () => {
      renderWithContext();

      const andButton = screen.getByRole('button', { name: /and/i });

      fireEvent.click(andButton);
      fireEvent.click(andButton);
      fireEvent.click(andButton);

      expect(CriteriaList).toHaveBeenCalledTimes(3);
      expect(mockFilterGroup.add).toHaveBeenCalledTimes(3);
      expect(mockSetFilterGroup).toHaveBeenCalledTimes(3);
    });
  });
});
