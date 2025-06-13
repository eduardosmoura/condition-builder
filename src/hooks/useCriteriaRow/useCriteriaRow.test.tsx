import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectChangeEvent } from '@mui/material/Select';
import { useCriteriaRow } from './useCriteriaRow';
import { Filter, Operator } from 'types';

const createMockFilter = (overrides: Partial<Filter> = {}): Filter => ({
  leftCondition: 'column1',
  operator: Operator.EQ,
  value: 'test value',
  id: '1',
  ...overrides
});

describe('useCriteriaRow', () => {
  let mockChangeLeftCondition: ReturnType<typeof vi.fn>;
  let mockChangeOperator: ReturnType<typeof vi.fn>;
  let mockChangeValue: ReturnType<typeof vi.fn>;
  let mockAddCriteria: ReturnType<typeof vi.fn>;
  let mockRemoveCriteria: ReturnType<typeof vi.fn>;
  let defaultProps: any;

  beforeEach(() => {
    mockChangeLeftCondition = vi.fn();
    mockChangeOperator = vi.fn();
    mockChangeValue = vi.fn();
    mockAddCriteria = vi.fn();
    mockRemoveCriteria = vi.fn();

    defaultProps = {
      filter: createMockFilter(),
      filterIndex: 0,
      changeLeftCondition: mockChangeLeftCondition,
      changeOperator: mockChangeOperator,
      changeValue: mockChangeValue,
      addCriteria: mockAddCriteria,
      removeCriteria: mockRemoveCriteria
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should return initial state correctly', () => {
      const { result } = renderHook(() => useCriteriaRow(defaultProps));

      expect(result.current.error).toBe(null);
      expect(result.current.placeholder).toBe(false);
      expect(typeof result.current.changeLeftCondition).toBe('function');
      expect(typeof result.current.changeOperator).toBe('function');
      expect(typeof result.current.changeValue).toBe('function');
      expect(typeof result.current.addHover).toBe('function');
      expect(typeof result.current.addLeave).toBe('function');
      expect(typeof result.current.handleAdd).toBe('function');
      expect(typeof result.current.handleRemove).toBe('function');
    });
  });

  describe('changeLeftCondition', () => {
    it('should call changeLeftCondition prop with correct parameters', () => {
      const { result } = renderHook(() => useCriteriaRow(defaultProps));

      const mockEvent = {
        target: { value: 'column2' }
      } as SelectChangeEvent;

      act(() => {
        result.current.changeLeftCondition(mockEvent);
      });

      expect(mockChangeLeftCondition).toHaveBeenCalledWith(0, 'column2');
    });

    it('should work with different filter index', () => {
      const props = { ...defaultProps, filterIndex: 2 };
      const { result } = renderHook(() => useCriteriaRow(props));

      const mockEvent = {
        target: { value: 'column3' }
      } as SelectChangeEvent;

      act(() => {
        result.current.changeLeftCondition(mockEvent);
      });

      expect(mockChangeLeftCondition).toHaveBeenCalledWith(2, 'column3');
    });
  });

  describe('changeOperator', () => {
    it('should call changeOperator prop with correct parameters and clear error', () => {
      const { result } = renderHook(() => useCriteriaRow(defaultProps));

      const mockEvent = {
        target: { value: 'GT' }
      } as SelectChangeEvent;

      act(() => {
        result.current.changeOperator(mockEvent);
      });

      expect(mockChangeOperator).toHaveBeenCalledWith(0, Operator.GT);
      expect(result.current.error).toBe(null);
    });

    it('should handle different operators', () => {
      const { result } = renderHook(() => useCriteriaRow(defaultProps));

      const mockEvent = {
        target: { value: 'LT' }
      } as SelectChangeEvent;

      act(() => {
        result.current.changeOperator(mockEvent);
      });

      expect(mockChangeOperator).toHaveBeenCalledWith(0, Operator.LT);
    });
  });

  describe('changeValue', () => {
    it('should call changeValue prop with correct parameters', () => {
      const { result } = renderHook(() => useCriteriaRow(defaultProps));

      const mockEvent = {
        target: { value: 'new test value' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(mockEvent);
      });

      expect(mockChangeValue).toHaveBeenCalledWith(0, 'new test value');
    });

    it('should not set error for valid numeric value with GT operator', () => {
      const filter = createMockFilter({ operator: Operator.GT });
      const props = { ...defaultProps, filter };
      const { result } = renderHook(() => useCriteriaRow(props));

      const mockEvent = {
        target: { value: '123.45' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(mockEvent);
      });

      expect(result.current.error).toBe(null);
      expect(mockChangeValue).toHaveBeenCalledWith(0, '123.45');
    });

    it('should not set error for valid negative numeric value with LT operator', () => {
      const filter = createMockFilter({ operator: Operator.LT });
      const props = { ...defaultProps, filter };
      const { result } = renderHook(() => useCriteriaRow(props));

      const mockEvent = {
        target: { value: '-42.5' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(mockEvent);
      });

      expect(result.current.error).toBe(null);
      expect(mockChangeValue).toHaveBeenCalledWith(0, '-42.5');
    });

    it('should set error for invalid numeric value with GT operator', () => {
      const filter = createMockFilter({ operator: Operator.GT });
      const props = { ...defaultProps, filter };
      const { result } = renderHook(() => useCriteriaRow(props));

      const mockEvent = {
        target: { value: 'not-a-number' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(mockEvent);
      });

      expect(result.current.error).toBe('Value must be numeric');
      expect(mockChangeValue).toHaveBeenCalledWith(0, 'not-a-number');
    });

    it('should set error for invalid numeric value with LT operator', () => {
      const filter = createMockFilter({ operator: Operator.LT });
      const props = { ...defaultProps, filter };
      const { result } = renderHook(() => useCriteriaRow(props));

      const mockEvent = {
        target: { value: 'abc123' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(mockEvent);
      });

      expect(result.current.error).toBe('Value must be numeric');
      expect(mockChangeValue).toHaveBeenCalledWith(0, 'abc123');
    });

    it('should not set error for non-numeric operators', () => {
      const filter = createMockFilter({ operator: Operator.EQ });
      const props = { ...defaultProps, filter };
      const { result } = renderHook(() => useCriteriaRow(props));

      const mockEvent = {
        target: { value: 'any text value' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(mockEvent);
      });

      expect(result.current.error).toBe(null);
      expect(mockChangeValue).toHaveBeenCalledWith(0, 'any text value');
    });

    it('should clear error when changing from invalid to valid value', () => {
      const filter = createMockFilter({ operator: Operator.GT });
      const props = { ...defaultProps, filter };
      const { result } = renderHook(() => useCriteriaRow(props));

      const invalidEvent = {
        target: { value: 'invalid' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(invalidEvent);
      });

      expect(result.current.error).toBe('Value must be numeric');

      const validEvent = {
        target: { value: '42' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(validEvent);
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('Placeholder State Management', () => {
    it('should set placeholder to true on addHover', () => {
      const { result } = renderHook(() => useCriteriaRow(defaultProps));

      expect(result.current.placeholder).toBe(false);

      act(() => {
        result.current.addHover();
      });

      expect(result.current.placeholder).toBe(true);
    });

    it('should set placeholder to false on addLeave', () => {
      const { result } = renderHook(() => useCriteriaRow(defaultProps));

      act(() => {
        result.current.addHover();
      });

      expect(result.current.placeholder).toBe(true);

      act(() => {
        result.current.addLeave();
      });

      expect(result.current.placeholder).toBe(false);
    });
  });

  describe('handleAdd', () => {
    it('should call addCriteria with correct index and reset placeholder', () => {
      const { result } = renderHook(() => useCriteriaRow(defaultProps));

      act(() => {
        result.current.addHover();
      });

      expect(result.current.placeholder).toBe(true);

      act(() => {
        result.current.handleAdd();
      });

      expect(mockAddCriteria).toHaveBeenCalledWith(0);
      expect(result.current.placeholder).toBe(false);
    });

    it('should work with different filter index', () => {
      const props = { ...defaultProps, filterIndex: 3 };
      const { result } = renderHook(() => useCriteriaRow(props));

      act(() => {
        result.current.handleAdd();
      });

      expect(mockAddCriteria).toHaveBeenCalledWith(3);
    });
  });

  describe('handleRemove', () => {
    it('should call removeCriteria with correct index', () => {
      const { result } = renderHook(() => useCriteriaRow(defaultProps));

      act(() => {
        result.current.handleRemove();
      });

      expect(mockRemoveCriteria).toHaveBeenCalledWith(0);
    });

    it('should work with different filter index', () => {
      const props = { ...defaultProps, filterIndex: 5 };
      const { result } = renderHook(() => useCriteriaRow(props));

      act(() => {
        result.current.handleRemove();
      });

      expect(mockRemoveCriteria).toHaveBeenCalledWith(5);
    });
  });

  describe('Numeric Validation Edge Cases', () => {
    it('should accept empty string as valid for numeric operators', () => {
      const filter = createMockFilter({ operator: Operator.GT });
      const props = { ...defaultProps, filter };
      const { result } = renderHook(() => useCriteriaRow(props));

      const mockEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(mockEvent);
      });

      expect(result.current.error).toBe(null);
    });

    it('should accept decimal point only as valid for numeric operators', () => {
      const filter = createMockFilter({ operator: Operator.LT });
      const props = { ...defaultProps, filter };
      const { result } = renderHook(() => useCriteriaRow(props));

      const mockEvent = {
        target: { value: '.' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(mockEvent);
      });

      expect(result.current.error).toBe(null);
    });

    it('should accept negative sign only as valid for numeric operators', () => {
      const filter = createMockFilter({ operator: Operator.GT });
      const props = { ...defaultProps, filter };
      const { result } = renderHook(() => useCriteriaRow(props));

      const mockEvent = {
        target: { value: '-' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(mockEvent);
      });

      expect(result.current.error).toBe(null);
    });

    it('should reject multiple decimal points', () => {
      const filter = createMockFilter({ operator: Operator.GT });
      const props = { ...defaultProps, filter };
      const { result } = renderHook(() => useCriteriaRow(props));

      const mockEvent = {
        target: { value: '12.34.56' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.changeValue(mockEvent);
      });

      expect(result.current.error).toBe('Value must be numeric');
    });
  });

  describe('Callback Stability', () => {
    it('should maintain callback references between re-renders when dependencies do not change', () => {
      const { result, rerender } = renderHook(() =>
        useCriteriaRow(defaultProps)
      );

      const initialCallbacks = {
        changeLeftCondition: result.current.changeLeftCondition,
        changeOperator: result.current.changeOperator,
        changeValue: result.current.changeValue,
        addHover: result.current.addHover,
        addLeave: result.current.addLeave,
        handleAdd: result.current.handleAdd,
        handleRemove: result.current.handleRemove
      };

      rerender();

      expect(result.current.changeLeftCondition).toBe(
        initialCallbacks.changeLeftCondition
      );
      expect(result.current.changeOperator).toBe(
        initialCallbacks.changeOperator
      );
      expect(result.current.changeValue).toBe(initialCallbacks.changeValue);
      expect(result.current.addHover).toBe(initialCallbacks.addHover);
      expect(result.current.addLeave).toBe(initialCallbacks.addLeave);
      expect(result.current.handleAdd).toBe(initialCallbacks.handleAdd);
      expect(result.current.handleRemove).toBe(initialCallbacks.handleRemove);
    });
  });
});
