import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { FilterContext } from 'contexts';
import { CriteriaGroup } from 'core';
import UrlInput from './UrlInput';
import { EMPTY_RESULT, EMPTY_CRITERIA_GROUP } from 'utils/constants';

const mockFetchResult = vi.fn();
const mockUrlService = {
  fetchResult: mockFetchResult
};

vi.mock('../../services/UrlService/UrlService', () => ({
  UrlService: vi.fn().mockImplementation(() => mockUrlService)
}));

vi.mock('../../utils/functions', () => ({
  deepClone: vi.fn((obj) => JSON.parse(JSON.stringify(obj))),
  generateId: vi.fn(() => 'test-id-123'),
  isUrl: vi.fn((url) => /^https?:\/\/.+/.test(url))
}));

vi.mock('../../utils/constants', async () => {
  const { CriteriaGroup } =
    await vi.importActual<typeof import('core')>('../../core');
  return {
    API_BASE_URL: 'https://jsonplaceholder.typicode.com/todos',
    HELPER_TEXT:
      'Insert data url. Returning data MUST be an array JSON with each element is key/value pair.',
    LOADING_DELAY: 500,
    EMPTY_RESULT: {
      columns: [],
      data: []
    },
    EMPTY_CRITERIA_GROUP: new CriteriaGroup()
  };
});

vi.mock('@mui/material', () => ({
  Box: ({ children, sx, ...props }: any) => (
    <div data-testid="box" style={sx} {...props}>
      {children}
    </div>
  ),
  TextField: ({
    id,
    label,
    error,
    helperText,
    onChange,
    onKeyPress,
    disabled,
    defaultValue,
    value,
    ...props
  }: any) => (
    <div data-testid="text-field">
      <input
        id={id}
        placeholder={label}
        onChange={onChange}
        onKeyDown={onKeyPress}
        onKeyPress={onKeyPress}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
        data-error={error}
        {...props}
      />
      {helperText && <div data-testid="helper-text">{helperText}</div>}
    </div>
  ),
  FormControl: ({ children, fullWidth, ...props }: any) => (
    <div data-testid="form-control" data-fullwidth={fullWidth} {...props}>
      {children}
    </div>
  )
}));

describe('UrlInput', () => {
  let mockFilterGroup: CriteriaGroup;
  let mockContextValue: any;
  let mockSetData: any;
  let mockSetFilterGroup: any;
  let mockSetLoading: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockFetchResult.mockResolvedValue({
      columns: ['id', 'title', 'completed'],
      data: [
        { id: 1, title: 'Test Todo', completed: false },
        { id: 2, title: 'Another Todo', completed: true }
      ]
    });

    mockFilterGroup = new CriteriaGroup();
    mockFilterGroup.clear = vi.fn();
    mockFilterGroup.add = vi.fn();

    mockSetData = vi.fn();
    mockSetFilterGroup = vi.fn();
    mockSetLoading = vi.fn();

    mockContextValue = {
      setResult: mockSetData,
      criteriaGroup: mockFilterGroup,
      setCriteriaGroup: mockSetFilterGroup,
      loading: false,
      setLoading: mockSetLoading
    };

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    expect(screen.getAllByTestId('box')).toHaveLength(2);
    expect(screen.getByTestId('form-control')).toBeInTheDocument();
    expect(screen.getByTestId('text-field')).toBeInTheDocument();
  });

  it('renders with default URL', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveProperty(
      'defaultValue',
      'https://jsonplaceholder.typicode.com/todos'
    );
  });

  it('renders helper text when no error', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    expect(screen.getByTestId('helper-text')).toHaveTextContent(
      'Insert data url. Returning data MUST be an array JSON with each element is key/value pair.'
    );
  });

  it('updates URL on input change', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: '  https://example.com/api  ' }
    });

    expect(input.value).toBe('  https://example.com/api  ');
  });

  it('loads data on Enter key press with valid URL', async () => {
    mockFetchResult.mockResolvedValue({
      columns: ['id', 'name'],
      data: [{ id: 1, name: 'Test' }]
    });

    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    await vi.runAllTimersAsync();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://example.com/api' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockFilterGroup.clear).toHaveBeenCalled();

    await vi.runAllTimersAsync();

    expect(mockFetchResult).toHaveBeenCalled();
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('shows error for invalid URL on Enter', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockSetData).toHaveBeenCalledWith(EMPTY_RESULT);
    expect(mockSetFilterGroup).toHaveBeenCalledWith(EMPTY_CRITERIA_GROUP);
    expect(screen.getByTestId('helper-text')).toHaveTextContent(
      'URL is invalid.'
    );
  });

  it('validates URLs correctly', () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    const input = screen.getByRole('textbox');

    const validUrls = [
      'https://example.com',
      'http://localhost:3000',
      'https://api.example.com/data',
      'http://192.168.1.1:8080/api'
    ];

    validUrls.forEach((url) => {
      fireEvent.change(input, { target: { value: url } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.queryByText('URL is invalid.')).not.toBeInTheDocument();
    });
  });

  it('disables input when loading', () => {
    mockContextValue.loading = true;

    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('prevents loading when already loading', async () => {
    mockContextValue.loading = true;

    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockSetLoading).not.toHaveBeenCalled();
  });

  it('handles data loading errors gracefully', async () => {
    mockFetchResult.mockRejectedValue(new Error('Network error'));

    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    await vi.runAllTimersAsync();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await vi.runAllTimersAsync();

    expect(mockSetData).toHaveBeenCalledWith(EMPTY_RESULT);
    expect(mockSetFilterGroup).toHaveBeenCalledWith(EMPTY_CRITERIA_GROUP);
    expect(screen.getByTestId('helper-text')).toHaveTextContent(
      'Network error'
    );
  });

  it('loads initial data on component mount', async () => {
    mockFetchResult.mockResolvedValue({
      columns: ['id', 'title'],
      data: [{ id: 1, title: 'Initial Todo' }]
    });

    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    await vi.runAllTimersAsync();

    expect(mockFetchResult).toHaveBeenCalled();
  });

  it('sets loading to false after timeout', async () => {
    mockFetchResult.mockResolvedValue({
      columns: ['id'],
      data: [{ id: 1 }]
    });

    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    await vi.runAllTimersAsync();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockSetLoading).toHaveBeenCalledWith(true);

    await vi.runAllTimersAsync();

    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('creates and adds filter after successful data load', async () => {
    mockFetchResult.mockResolvedValue({
      columns: ['id', 'name'],
      data: [{ id: 1, name: 'Test' }]
    });

    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    await vi.runAllTimersAsync();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await vi.runAllTimersAsync();

    expect(mockFilterGroup.add).toHaveBeenCalled();
    expect(mockSetFilterGroup).toHaveBeenCalled();
  });

  it('ignores non-Enter key presses', async () => {
    render(
      <FilterContext.Provider value={mockContextValue}>
        <UrlInput />
      </FilterContext.Provider>
    );

    await vi.runAllTimersAsync();
    mockSetLoading.mockClear();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.keyDown(input, { key: 'Space' });
    fireEvent.keyDown(input, { key: 'Tab' });

    expect(mockSetLoading).not.toHaveBeenCalled();
  });
});
