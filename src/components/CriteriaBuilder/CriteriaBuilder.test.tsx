import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FilterContext } from '../../contexts/FilterContext/FilterContext';
import { CriteriaGroup, CriteriaList } from '../../core';
import { Filter, Operator } from '../../types';
import CriteriaBuilder from './CriteriaBuilder';

vi.mock('../CriteriaGroup/CriteriaGroup', () => ({
  default: ({ criteriaList, criteriaListIndex, columns }: any) => (
    <div data-testid={`criteria-group-${criteriaListIndex}`}>
      Mock CriteriaGroup - CriteriaList items: {criteriaList.all().length},
      Columns: {columns.length}
    </div>
  )
}));

describe('CriteriaBuilder', () => {
  const mockColumns = ['name', 'age', 'email'];

  const createMockFilter = (id: string): Filter => ({
    leftCondition: mockColumns[0],
    operator: Operator.EQ,
    value: 'test',
    id
  });

  let mockFilterGroup: CriteriaGroup;
  let mockContextValue: any;

  beforeEach(() => {
    mockFilterGroup = new CriteriaGroup();
    mockContextValue = {
      result: { columns: mockColumns, data: [] },
      criteriaGroup: mockFilterGroup,
      setCriteriaGroup: vi.fn(),
      setResult: vi.fn(),
      loading: false,
      setLoading: vi.fn()
    };
  });

  it('renders without crashing', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <CriteriaBuilder />
      </FilterContext.Provider>
    );
  });

  it('renders empty when criteriaGroup has no filter lists', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <CriteriaBuilder />
      </FilterContext.Provider>
    );

    expect(screen.queryByTestId(/criteria-group-/)).not.toBeInTheDocument();
  });

  it('renders single CriteriaGroup when criteriaGroup has one filter list', () => {
    const criteriaList = new CriteriaList();
    criteriaList.add(createMockFilter('1'));
    mockFilterGroup.add(criteriaList);

    render(
      <FilterContext.Provider value={mockContextValue}>
        <CriteriaBuilder />
      </FilterContext.Provider>
    );

    expect(screen.getByTestId('criteria-group-0')).toBeInTheDocument();
    expect(
      screen.getByText(/Mock CriteriaGroup - CriteriaList items: 1, Columns: 3/)
    ).toBeInTheDocument();
  });

  it('renders multiple CriteriaGroup components when criteriaGroup has multiple filter lists', () => {
    const filterList1 = new CriteriaList();
    filterList1.add(createMockFilter('1'));
    filterList1.add(createMockFilter('2'));

    const filterList2 = new CriteriaList();
    filterList2.add(createMockFilter('3'));

    mockFilterGroup.add(filterList1);
    mockFilterGroup.add(filterList2);

    render(
      <FilterContext.Provider value={mockContextValue}>
        <CriteriaBuilder />
      </FilterContext.Provider>
    );

    expect(screen.getByTestId('criteria-group-0')).toBeInTheDocument();
    expect(screen.getByTestId('criteria-group-1')).toBeInTheDocument();
    expect(
      screen.getByText(/Mock CriteriaGroup - CriteriaList items: 2, Columns: 3/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Mock CriteriaGroup - CriteriaList items: 1, Columns: 3/)
    ).toBeInTheDocument();
  });

  it('handles null criteriaGroup gracefully', () => {
    mockContextValue.criteriaGroup = null;

    render(
      <FilterContext.Provider value={mockContextValue}>
        <CriteriaBuilder />
      </FilterContext.Provider>
    );

    expect(screen.queryByTestId(/criteria-group-/)).not.toBeInTheDocument();
  });

  it('handles undefined criteriaGroup gracefully', () => {
    mockContextValue.criteriaGroup = undefined;

    render(
      <FilterContext.Provider value={mockContextValue}>
        <CriteriaBuilder />
      </FilterContext.Provider>
    );

    expect(screen.queryByTestId(/criteria-group-/)).not.toBeInTheDocument();
  });

  it('passes correct props to CriteriaGroup components', () => {
    const filterList1 = new CriteriaList();
    filterList1.add(createMockFilter('1'));

    const filterList2 = new CriteriaList();
    filterList2.add(createMockFilter('2'));
    filterList2.add(createMockFilter('3'));

    mockFilterGroup.add(filterList1);
    mockFilterGroup.add(filterList2);

    render(
      <FilterContext.Provider value={mockContextValue}>
        <CriteriaBuilder />
      </FilterContext.Provider>
    );

    expect(
      screen.getByText(/Mock CriteriaGroup - CriteriaList items: 1, Columns: 3/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Mock CriteriaGroup - CriteriaList items: 2, Columns: 3/)
    ).toBeInTheDocument();
  });
});
