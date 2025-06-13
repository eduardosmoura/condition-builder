import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CriteriaGroup from './CriteriaGroup';
import { FilterContext, NotificationProvider } from 'contexts';
import { CriteriaGroup as CriteriaGroupCore, CriteriaList } from 'core';
import { Filter, Operator, Result } from 'types';

vi.mock('./CriteriaRow', () => ({
  default: vi.fn(
    ({
      filter,
      criteriaListIndex,
      filterIndex,
      changeLeftCondition,
      changeOperator,
      changeValue,
      addCriteria,
      removeCriteria
    }) => (
      <div data-testid={`criteria-row-${criteriaListIndex}-${filterIndex}`}>
        <span>Filter: {filter.leftCondition}</span>
        <span>Operator: {filter.operator}</span>
        <span>Value: {filter.value}</span>
        <button onClick={() => changeLeftCondition(filterIndex, 'newColumn')}>
          Change Left Condition
        </button>
        <button onClick={() => changeOperator(filterIndex, Operator.GT)}>
          Change Operator
        </button>
        <button onClick={() => changeValue(filterIndex, 'newValue')}>
          Change Value
        </button>
        <button onClick={() => addCriteria(filterIndex)}>Add</button>
        <button onClick={() => removeCriteria(filterIndex)}>Remove</button>
      </div>
    )
  )
}));

const createMockFilter = (overrides: Partial<Filter> = {}): Filter => ({
  leftCondition: 'column1',
  operator: Operator.EQ,
  value: 'test value',
  id: '1',
  ...overrides
});

const createMockData = (): Result => ({
  columns: ['column1', 'column2', 'column3'],
  data: []
});

const createMockCriteriaList = (filters: Filter[] = []): CriteriaList => {
  const criteriaList = new CriteriaList();
  filters.forEach((filter) => criteriaList.add(filter));
  return criteriaList;
};

const createMockFilterGroup = (
  filterLists: CriteriaList[] = []
): CriteriaGroupCore => {
  const criteriaGroup = new CriteriaGroupCore();
  filterLists.forEach((criteriaList) => criteriaGroup.add(criteriaList));
  return criteriaGroup;
};

const createMockContextValue = (overrides = {}) => ({
  result: createMockData(),
  setResult: vi.fn(),
  criteriaGroup: createMockFilterGroup(),
  setCriteriaGroup: vi.fn(),
  loading: false,
  setLoading: vi.fn(),
  ...overrides
});

const TestWrapper = ({
  children,
  contextValue = createMockContextValue()
}: {
  children: React.ReactNode;
  contextValue?: any;
}) => (
  <NotificationProvider>
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  </NotificationProvider>
);

describe('CriteriaGroup', () => {
  const defaultProps = {
    criteriaList: createMockCriteriaList([createMockFilter()]),
    criteriaListIndex: 0,
    columns: ['column1', 'column2', 'column3']
  };

  const renderCriteriaGroup = (
    props = defaultProps,
    contextValue = createMockContextValue()
  ) => {
    return render(
      <TestWrapper contextValue={contextValue}>
        <CriteriaGroup {...props} />
      </TestWrapper>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the AND connector', () => {
      renderCriteriaGroup();
      expect(screen.getByText('AND')).toBeInTheDocument();
    });

    it('should render with correct CSS classes', () => {
      renderCriteriaGroup();
      expect(
        document.querySelector('.criteria-group-container')
      ).toBeInTheDocument();
      expect(document.querySelector('.criteria-group')).toBeInTheDocument();
      expect(document.querySelector('.criteria-group-0')).toBeInTheDocument();
      expect(document.querySelector('.and-button')).toBeInTheDocument();
    });

    it('should not render CriteriaRow components when criteriaList is empty', () => {
      const emptyCriteriaList = createMockCriteriaList([]);
      renderCriteriaGroup({ ...defaultProps, criteriaList: emptyCriteriaList });

      expect(screen.queryByTestId('criteria-row-0-0')).not.toBeInTheDocument();
    });

    it('should render with correct criteriaListIndex class', () => {
      renderCriteriaGroup({ ...defaultProps, criteriaListIndex: 2 });
      expect(document.querySelector('.criteria-group-2')).toBeInTheDocument();
    });
  });

  describe('Context Integration', () => {
    it('should use context data correctly', () => {
      const mockContextValue = createMockContextValue({
        data: { columns: ['test-column'], data: [] },
        loading: true
      });

      renderCriteriaGroup(defaultProps, mockContextValue);

      expect(screen.getByText('AND')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should handle undefined columns prop', () => {
      const propsWithUndefinedColumns = {
        ...defaultProps,
        columns: undefined as any
      };

      expect(() =>
        renderCriteriaGroup(propsWithUndefinedColumns)
      ).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty criteriaList gracefully', () => {
      const emptyCriteriaList = createMockCriteriaList([]);
      const props = { ...defaultProps, criteriaList: emptyCriteriaList };

      expect(() => renderCriteriaGroup(props)).not.toThrow();
      expect(screen.getByText('AND')).toBeInTheDocument();
    });
  });
});
