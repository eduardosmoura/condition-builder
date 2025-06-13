import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FilterContext } from 'contexts';
import { CriteriaGroup, CriteriaList } from 'core';
import { Filter, Operator } from 'types';
import ResultContainer from './ResultContainer';

const mockSearchInstance = {
  search: vi.fn()
};

vi.mock('core', async () => {
  const actual = await vi.importActual('core');
  return {
    ...actual,
    CriteriaSearch: vi.fn().mockImplementation(() => mockSearchInstance)
  };
});

vi.mock('../ResultTable/ResultTable', () => ({
  default: ({ columns, rows, loading }: any) => (
    <div data-testid="results-table">
      Mock ResultTable - Columns: {columns.length}, Rows: {rows.length},
      Loading: {loading.toString()}
    </div>
  )
}));

describe('ResultContainer', () => {
  const mockColumns = ['name', 'age', 'email'];
  const mockData = [
    { id: 1, name: 'John', age: 30, email: 'john@test.com' },
    { id: 2, name: 'Jane', age: 25, email: 'jane@test.com' },
    { id: 3, name: 'Bob', age: 35, email: 'bob@test.com' }
  ];

  let mockFilterGroup: CriteriaGroup;
  let mockContextValue: any;

  beforeEach(() => {
    mockFilterGroup = new CriteriaGroup();
    mockContextValue = {
      result: {
        columns: mockColumns,
        data: mockData
      },
      criteriaGroup: mockFilterGroup,
      loading: false,
      setCriteriaGroup: vi.fn(),
      setResult: vi.fn(),
      setLoading: vi.fn()
    };

    mockSearchInstance.search.mockReturnValue(mockData);
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );
  });

  it('renders the Result title', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(screen.getByText('Result')).toBeInTheDocument();
  });

  it('displays total count chip with correct data count', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(screen.getByText('Total: 3')).toBeInTheDocument();
  });

  it('displays filtered count chip with correct filtered data count', () => {
    mockSearchInstance.search.mockReturnValue([mockData[0], mockData[1]]);

    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(screen.getByText('Filtered: 2')).toBeInTheDocument();
  });

  it('shows loading state in chips when loading is true', () => {
    mockContextValue.loading = true;

    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(screen.getByText('Total: -')).toBeInTheDocument();
    expect(screen.getByText('Filtered: -')).toBeInTheDocument();
  });

  it('passes correct props to ResultTable', () => {
    const filteredData = [mockData[0]];
    mockSearchInstance.search.mockReturnValue(filteredData);

    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(screen.getByTestId('results-table')).toBeInTheDocument();
    expect(
      screen.getByText('Mock ResultTable - Columns: 3, Rows: 1, Loading: false')
    ).toBeInTheDocument();
  });

  it('passes loading state to ResultTable', () => {
    mockContextValue.loading = true;

    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(
      screen.getByText('Mock ResultTable - Columns: 3, Rows: 3, Loading: true')
    ).toBeInTheDocument();
  });

  it('creates Search instance with correct parameters', async () => {
    const { CriteriaSearch } = vi.mocked(await import('core'));

    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(CriteriaSearch).toHaveBeenCalledWith(mockData, mockFilterGroup);
  });

  it('calls search method on Search instance', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(mockSearchInstance.search).toHaveBeenCalled();
  });

  it('handles empty data gracefully', () => {
    mockContextValue.result.data = [];
    mockSearchInstance.search.mockReturnValue([]);

    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(screen.getByText('Total: 0')).toBeInTheDocument();
    expect(screen.getByText('Filtered: 0')).toBeInTheDocument();
    expect(
      screen.getByText('Mock ResultTable - Columns: 3, Rows: 0, Loading: false')
    ).toBeInTheDocument();
  });

  it('handles empty columns gracefully', () => {
    mockContextValue.result.columns = [];

    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(
      screen.getByText('Mock ResultTable - Columns: 0, Rows: 3, Loading: false')
    ).toBeInTheDocument();
  });

  it('updates filtered data when filter changes', () => {
    const filteredData = [mockData[0]];
    mockSearchInstance.search.mockReturnValue(filteredData);

    render(
      <FilterContext.Provider value={mockContextValue}>
        <ResultContainer />
      </FilterContext.Provider>
    );

    expect(screen.getByText('Filtered: 1')).toBeInTheDocument();
    expect(
      screen.getByText('Mock ResultTable - Columns: 3, Rows: 1, Loading: false')
    ).toBeInTheDocument();
  });
});
