import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import ResultTable from './ResultTable';

vi.mock('@mui/x-data-grid', () => ({
  DataGrid: ({
    rows,
    columns,
    loading,
    pageSize,
    onPageSizeChange,
    ...props
  }: any) => (
    <div data-testid="data-grid">
      <div data-testid="grid-rows-count">{rows.length}</div>
      <div data-testid="grid-columns-count">{columns.length}</div>
      <div data-testid="grid-loading">{loading.toString()}</div>
      <div data-testid="grid-page-size">{pageSize}</div>
      {columns.map((col: any, index: number) => (
        <div key={index} data-testid={`column-${col.field}`}>
          {col.headerName}
        </div>
      ))}
      {rows.map((row: any, index: number) => (
        <div key={index} data-testid={`row-${index}`}>
          {JSON.stringify(row)}
        </div>
      ))}
      <button
        data-testid="page-size-button"
        onClick={() => onPageSizeChange && onPageSizeChange(50)}
      >
        Change Page Size
      </button>
    </div>
  ),
  GridColDef: {} as any,
  GridValueGetterParams: {} as any
}));

vi.mock('@mui/material', () => ({
  Box: ({ children, sx, ...props }: any) => (
    <div data-testid="box" style={sx} {...props}>
      {children}
    </div>
  ),
  Skeleton: ({ variant, sx, ...props }: any) => (
    <div data-testid="skeleton" data-variant={variant} style={sx} {...props} />
  )
}));

describe('ResultTable', () => {
  const mockColumns = ['name', 'age', 'email'];
  const mockRows = [
    { id: 1, name: 'John', age: 30, email: 'john@test.com' },
    { id: 2, name: 'Jane', age: 25, email: 'jane@test.com' },
    { id: 3, name: 'Bob', age: 35, email: 'bob@test.com' }
  ];

  const defaultProps = {
    columns: mockColumns,
    rows: mockRows,
    loading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ResultTable {...defaultProps} />);
    expect(screen.getByTestId('box')).toBeInTheDocument();
  });

  it('renders DataGrid when not loading', () => {
    render(<ResultTable {...defaultProps} />);

    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });

  it('renders loading skeleton when loading is true', () => {
    render(<ResultTable {...defaultProps} loading={true} />);

    expect(screen.queryByTestId('data-grid')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton')).toHaveLength(18);
  });

  it('passes correct props to DataGrid', () => {
    render(<ResultTable {...defaultProps} />);

    expect(screen.getByTestId('grid-rows-count')).toHaveTextContent('3');
    expect(screen.getByTestId('grid-columns-count')).toHaveTextContent('3');
    expect(screen.getByTestId('grid-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('grid-page-size')).toHaveTextContent('100');
  });

  it('creates correct column configuration', () => {
    render(<ResultTable {...defaultProps} />);

    mockColumns.forEach((column) => {
      expect(screen.getByTestId(`column-${column}`)).toHaveTextContent(column);
    });
  });

  it('renders all rows correctly', () => {
    render(<ResultTable {...defaultProps} />);

    mockRows.forEach((row, index) => {
      expect(screen.getByTestId(`row-${index}`)).toHaveTextContent(
        JSON.stringify(row)
      );
    });
  });

  it('handles page size changes', () => {
    render(<ResultTable {...defaultProps} />);

    const pageSizeButton = screen.getByTestId('page-size-button');
    fireEvent.click(pageSizeButton);

    expect(screen.getByTestId('grid-page-size')).toHaveTextContent('50');
  });

  it('handles empty columns array', () => {
    render(<ResultTable {...defaultProps} columns={[]} />);

    expect(screen.getByTestId('grid-columns-count')).toHaveTextContent('0');
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
  });

  it('handles empty rows array', () => {
    render(<ResultTable {...defaultProps} rows={[]} />);

    expect(screen.getByTestId('grid-rows-count')).toHaveTextContent('0');
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
  });

  it('handles rows with object values correctly', () => {
    const rowsWithObjects = [
      { id: 1, name: 'John', metadata: { age: 30, city: 'NYC' } },
      { id: 2, name: 'Jane', metadata: { age: 25, city: 'LA' } }
    ];
    const columnsWithObject = ['name', 'metadata'];

    render(
      <ResultTable
        columns={columnsWithObject}
        rows={rowsWithObjects}
        loading={false}
      />
    );

    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
    expect(screen.getByTestId('grid-rows-count')).toHaveTextContent('2');
  });

  it('applies correct container styles', () => {
    render(<ResultTable {...defaultProps} />);

    const container = screen.getByTestId('box');
    expect(container).toHaveStyle({
      height: '630px',
      width: '100%',
      marginBottom: '100px'
    });
  });

  it('renders skeleton with correct count during loading', () => {
    render(<ResultTable {...defaultProps} loading={true} />);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(18);

    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveAttribute('data-variant', 'rectangular');
    });
  });

  it('toggles between loading and loaded states correctly', () => {
    const { rerender } = render(
      <ResultTable {...defaultProps} loading={true} />
    );

    expect(screen.getAllByTestId('skeleton')).toHaveLength(18);
    expect(screen.queryByTestId('data-grid')).not.toBeInTheDocument();

    rerender(<ResultTable {...defaultProps} loading={false} />);

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
  });

  it('maintains page size state correctly', () => {
    render(<ResultTable {...defaultProps} />);

    expect(screen.getByTestId('grid-page-size')).toHaveTextContent('100');

    const pageSizeButton = screen.getByTestId('page-size-button');
    fireEvent.click(pageSizeButton);

    expect(screen.getByTestId('grid-page-size')).toHaveTextContent('50');
  });
});
