import { act, renderHook } from '@testing-library/react';
import { CriteriaGroup, CriteriaList } from 'core';
import { Operator, Result } from 'types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCriteriaGroup } from './useCriteriaGroup';

const mockShowWarning = vi.fn();
const mockShowError = vi.fn();

vi.mock('contexts', () => ({
  useNotification: () => ({
    showError: mockShowError,
    showWarning: mockShowWarning,
    showSuccess: vi.fn(),
    showInfo: vi.fn(),
    showNotification: vi.fn()
  })
}));

const createMockData = (): Result => ({
  columns: ['column1', 'column2', 'column3'],
  data: []
});

const createMockCriteriaList = (): CriteriaList => {
  const criteriaList = new CriteriaList();
  criteriaList.add({
    leftCondition: 'column1',
    operator: Operator.EQ,
    value: 'test',
    id: '1'
  });
  return criteriaList;
};

const createMockFilterGroup = (criteriaList: CriteriaList): CriteriaGroup => {
  const criteriaGroup = new CriteriaGroup();
  criteriaGroup.add(criteriaList);
  return criteriaGroup;
};

describe('useCriteriaGroup', () => {
  let mockSetFilterGroup: ReturnType<typeof vi.fn>;
  let defaultProps: any;

  beforeEach(() => {
    mockSetFilterGroup = vi.fn();
    mockShowWarning.mockClear();
    mockShowError.mockClear();
    defaultProps = {
      criteriaList: createMockCriteriaList(),
      criteriaListIndex: 0,
      result: createMockData(),
      criteriaGroup: createMockFilterGroup(createMockCriteriaList()),
      setCriteriaGroup: mockSetFilterGroup
    };
  });

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useCriteriaGroup(defaultProps));

    expect(result.current.filters).toHaveLength(1);
    expect(result.current.hasFilters).toBe(true);
    expect(typeof result.current.changeLeftCondition).toBe('function');
    expect(typeof result.current.changeOperator).toBe('function');
    expect(typeof result.current.changeValue).toBe('function');
    expect(typeof result.current.addCriteria).toBe('function');
    expect(typeof result.current.removeCriteria).toBe('function');
  });

  it('should handle empty criteria list', () => {
    const emptyCriteriaList = new CriteriaList();
    const props = { ...defaultProps, criteriaList: emptyCriteriaList };

    const { result } = renderHook(() => useCriteriaGroup(props));

    expect(result.current.filters).toHaveLength(0);
    expect(result.current.hasFilters).toBe(false);
  });

  it('should call setCriteriaGroup when changing left condition', () => {
    const { result } = renderHook(() => useCriteriaGroup(defaultProps));

    act(() => {
      result.current.changeLeftCondition(0, 'column2');
    });

    expect(mockSetFilterGroup).toHaveBeenCalled();
  });

  it('should call setCriteriaGroup when changing operator', () => {
    const { result } = renderHook(() => useCriteriaGroup(defaultProps));

    act(() => {
      result.current.changeOperator(0, Operator.GT);
    });

    expect(mockSetFilterGroup).toHaveBeenCalled();
  });

  it('should call setCriteriaGroup when changing value', () => {
    const { result } = renderHook(() => useCriteriaGroup(defaultProps));

    act(() => {
      result.current.changeValue(0, 'new value');
    });

    expect(mockSetFilterGroup).toHaveBeenCalled();
  });

  it('should call setCriteriaGroup when adding condition row', () => {
    const { result } = renderHook(() => useCriteriaGroup(defaultProps));

    act(() => {
      result.current.addCriteria(0);
    });

    expect(mockSetFilterGroup).toHaveBeenCalled();
  });

  it('should call setCriteriaGroup when removing condition row', () => {
    const { result } = renderHook(() => useCriteriaGroup(defaultProps));

    act(() => {
      result.current.removeCriteria(0);
    });

    expect(mockSetFilterGroup).toHaveBeenCalled();
  });

  it('should handle errors gracefully', () => {
    const { result } = renderHook(() => useCriteriaGroup(defaultProps));

    act(() => {
      result.current.changeLeftCondition(999, 'column2');
    });

    expect(mockShowWarning).toHaveBeenCalledWith(
      'Filter at index 999 not found'
    );
  });

  it('should warn when adding condition with no columns', () => {
    const resultWithNoColumns = { columns: [], data: [] };
    const props = { ...defaultProps, result: resultWithNoColumns };

    const { result } = renderHook(() => useCriteriaGroup(props));

    act(() => {
      result.current.addCriteria(0);
    });

    expect(mockShowWarning).toHaveBeenCalledWith(
      'No columns available to create new filter'
    );
  });
});
