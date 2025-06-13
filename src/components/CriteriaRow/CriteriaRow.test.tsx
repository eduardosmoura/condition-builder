import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import CriteriaRow from './CriteriaRow';
import { Filter, Operator } from 'types';
import { useCriteriaRow } from '../../hooks/useCriteriaRow/useCriteriaRow';

vi.mock('../../hooks/useCriteriaRow/useCriteriaRow', () => ({
  useCriteriaRow: vi.fn(() => ({
    error: null,
    placeholder: false,
    changeLeftCondition: vi.fn(),
    changeOperator: vi.fn(),
    changeValue: vi.fn(),
    addHover: vi.fn(),
    addLeave: vi.fn(),
    handleAdd: vi.fn(),
    handleRemove: vi.fn()
  }))
}));

const mockUseCriteriaRow = vi.mocked(useCriteriaRow);

vi.mock('../../utils/functions', () => ({
  retrieveOperatorValue: vi.fn((enumObj, value) => {
    const keys = Object.keys(enumObj).filter((x) => enumObj[x] === value);
    return keys.length > 0 ? keys[0] : '';
  })
}));

const createMockFilter = (overrides: Partial<Filter> = {}): Filter => ({
  leftCondition: 'column1',
  operator: Operator.EQ,
  value: 'test value',
  id: '1',
  ...overrides
});

describe('CriteriaRow', () => {
  const defaultProps = {
    filter: createMockFilter(),
    criteriaListIndex: 0,
    filterIndex: 0,
    columns: ['column1', 'column2', 'column3'],
    changeLeftCondition: vi.fn(),
    changeOperator: vi.fn(),
    changeValue: vi.fn(),
    addCriteria: vi.fn(),
    removeCriteria: vi.fn(),
    loading: false
  };

  const renderCriteriaRow = (props = defaultProps) => {
    return render(<CriteriaRow {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCriteriaRow.mockReturnValue({
      error: null,
      placeholder: false,
      changeLeftCondition: vi.fn(),
      changeOperator: vi.fn(),
      changeValue: vi.fn(),
      addHover: vi.fn(),
      addLeave: vi.fn(),
      handleAdd: vi.fn(),
      handleRemove: vi.fn()
    });
  });

  describe('Rendering', () => {
    it('should render with correct CSS classes', () => {
      renderCriteriaRow();
      expect(document.querySelector('.criteria-row')).toBeInTheDocument();
      expect(document.querySelector('.criteria-row-0-0')).toBeInTheDocument();
    });

    it('should render with correct criteriaListIndex and filterIndex in class', () => {
      renderCriteriaRow({
        ...defaultProps,
        criteriaListIndex: 2,
        filterIndex: 3
      });
      expect(document.querySelector('.criteria-row-2-3')).toBeInTheDocument();
    });

    it('should render Left Condition select with correct label and value', () => {
      renderCriteriaRow();
      expect(screen.getByLabelText('Left Condition')).toBeInTheDocument();
      expect(screen.getByDisplayValue('column1')).toBeInTheDocument();
    });

    it('should render Operator select with correct label', () => {
      renderCriteriaRow();
      expect(screen.getByLabelText('Operator')).toBeInTheDocument();
    });

    it('should render Value text field with correct label and value', () => {
      renderCriteriaRow();
      expect(screen.getByLabelText('Value')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('should render Add and Remove buttons', () => {
      renderCriteriaRow();
      expect(screen.getByLabelText('Add')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove')).toBeInTheDocument();
    });

    it('should render OR connector when filterIndex >= 1', () => {
      renderCriteriaRow({ ...defaultProps, filterIndex: 1 });
      expect(screen.getByText('OR')).toBeInTheDocument();
    });

    it('should not render OR connector when filterIndex is 0', () => {
      renderCriteriaRow({ ...defaultProps, filterIndex: 0 });
      expect(screen.queryByText('OR')).not.toBeInTheDocument();
    });

    it('should render all column options in Left Condition select', () => {
      renderCriteriaRow();
      const select = screen.getByLabelText('Left Condition');
      fireEvent.mouseDown(select);

      expect(
        screen.getByRole('option', { name: 'column1' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'column2' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'column3' })
      ).toBeInTheDocument();
    });

    it('should render all operator options in Operator select', () => {
      renderCriteriaRow();
      const select = screen.getByLabelText('Operator');
      fireEvent.mouseDown(select);

      expect(
        screen.getByRole('option', { name: 'Equals' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Greater Than' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Less Than' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Contains' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Not Contains' })
      ).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Regex' })).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should render skeletons when loading is true', () => {
      renderCriteriaRow({ ...defaultProps, loading: true });

      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should not render form controls when loading is true', () => {
      renderCriteriaRow({ ...defaultProps, loading: true });

      expect(screen.queryByLabelText('Left Condition')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Operator')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Value')).not.toBeInTheDocument();
    });

    it('should render form controls when loading is false', () => {
      renderCriteriaRow({ ...defaultProps, loading: false });

      expect(screen.getByLabelText('Left Condition')).toBeInTheDocument();
      expect(screen.getByLabelText('Operator')).toBeInTheDocument();
      expect(screen.getByLabelText('Value')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error exists', () => {
      mockUseCriteriaRow.mockReturnValue({
        error: 'Value must be numeric',
        placeholder: false,
        changeLeftCondition: vi.fn(),
        changeOperator: vi.fn(),
        changeValue: vi.fn(),
        addHover: vi.fn(),
        addLeave: vi.fn(),
        handleAdd: vi.fn(),
        handleRemove: vi.fn()
      });

      renderCriteriaRow();
      expect(screen.getByText('Value must be numeric')).toBeInTheDocument();
    });

    it('should not display error message when error is null', () => {
      renderCriteriaRow();
      expect(
        screen.queryByText('Value must be numeric')
      ).not.toBeInTheDocument();
    });
  });

  describe('Placeholder', () => {
    it('should show placeholder skeleton when placeholder is true', () => {
      mockUseCriteriaRow.mockReturnValue({
        error: null,
        placeholder: true,
        changeLeftCondition: vi.fn(),
        changeOperator: vi.fn(),
        changeValue: vi.fn(),
        addHover: vi.fn(),
        addLeave: vi.fn(),
        handleAdd: vi.fn(),
        handleRemove: vi.fn()
      });

      renderCriteriaRow();
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should not show placeholder skeleton when placeholder is false', () => {
      renderCriteriaRow();
      const placeholderContainer = document.querySelector(
        '.MuiBox-root[sx*="placeholderContainer"]'
      );
      expect(placeholderContainer).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call changeLeftCondition when Left Condition select changes', async () => {
      const mockChangeLeftCondition = vi.fn();
      mockUseCriteriaRow.mockReturnValue({
        error: null,
        placeholder: false,
        changeLeftCondition: mockChangeLeftCondition,
        changeOperator: vi.fn(),
        changeValue: vi.fn(),
        addHover: vi.fn(),
        addLeave: vi.fn(),
        handleAdd: vi.fn(),
        handleRemove: vi.fn()
      });

      renderCriteriaRow();
      const select = screen.getByLabelText('Left Condition');

      fireEvent.mouseDown(select);

      const option = screen.getByRole('option', { name: 'column2' });
      fireEvent.click(option);

      expect(mockChangeLeftCondition).toHaveBeenCalled();
    });

    it('should call changeOperator when Operator select changes', () => {
      const mockChangeOperator = vi.fn();
      mockUseCriteriaRow.mockReturnValue({
        error: null,
        placeholder: false,
        changeLeftCondition: vi.fn(),
        changeOperator: mockChangeOperator,
        changeValue: vi.fn(),
        addHover: vi.fn(),
        addLeave: vi.fn(),
        handleAdd: vi.fn(),
        handleRemove: vi.fn()
      });

      renderCriteriaRow();
      const select = screen.getByLabelText('Operator');

      fireEvent.mouseDown(select);

      const option = screen.getByRole('option', { name: 'Greater Than' });
      fireEvent.click(option);

      expect(mockChangeOperator).toHaveBeenCalled();
    });

    it('should call changeValue when Value input changes', () => {
      const mockChangeValue = vi.fn();
      mockUseCriteriaRow.mockReturnValue({
        error: null,
        placeholder: false,
        changeLeftCondition: vi.fn(),
        changeOperator: vi.fn(),
        changeValue: mockChangeValue,
        addHover: vi.fn(),
        addLeave: vi.fn(),
        handleAdd: vi.fn(),
        handleRemove: vi.fn()
      });

      renderCriteriaRow();
      const input = screen.getByLabelText('Value');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(mockChangeValue).toHaveBeenCalled();
    });

    it('should call handleAdd when Add button is clicked', () => {
      const mockHandleAdd = vi.fn();
      mockUseCriteriaRow.mockReturnValue({
        error: null,
        placeholder: false,
        changeLeftCondition: vi.fn(),
        changeOperator: vi.fn(),
        changeValue: vi.fn(),
        addHover: vi.fn(),
        addLeave: vi.fn(),
        handleAdd: mockHandleAdd,
        handleRemove: vi.fn()
      });

      renderCriteriaRow();
      const addButton = screen.getByLabelText('Add');
      fireEvent.click(addButton);

      expect(mockHandleAdd).toHaveBeenCalled();
    });

    it('should call handleRemove when Remove button is clicked', () => {
      const mockHandleRemove = vi.fn();
      mockUseCriteriaRow.mockReturnValue({
        error: null,
        placeholder: false,
        changeLeftCondition: vi.fn(),
        changeOperator: vi.fn(),
        changeValue: vi.fn(),
        addHover: vi.fn(),
        addLeave: vi.fn(),
        handleAdd: vi.fn(),
        handleRemove: mockHandleRemove
      });

      renderCriteriaRow();
      const removeButton = screen.getByLabelText('Remove');
      fireEvent.click(removeButton);

      expect(mockHandleRemove).toHaveBeenCalled();
    });

    it('should call addHover and addLeave on mouse events', () => {
      const mockAddHover = vi.fn();
      const mockAddLeave = vi.fn();
      mockUseCriteriaRow.mockReturnValue({
        error: null,
        placeholder: false,
        changeLeftCondition: vi.fn(),
        changeOperator: vi.fn(),
        changeValue: vi.fn(),
        addHover: mockAddHover,
        addLeave: mockAddLeave,
        handleAdd: vi.fn(),
        handleRemove: vi.fn()
      });

      renderCriteriaRow();
      const addButton = screen.getByLabelText('Add');
      const addButtonContainer = addButton.parentElement;

      if (addButtonContainer) {
        fireEvent.mouseEnter(addButtonContainer);
        expect(mockAddHover).toHaveBeenCalled();

        fireEvent.mouseLeave(addButtonContainer);
        expect(mockAddLeave).toHaveBeenCalled();
      }
    });
  });

  describe('Props Handling', () => {
    it('should handle undefined columns prop', () => {
      const propsWithUndefinedColumns = {
        ...defaultProps,
        columns: undefined as any
      };

      expect(() => renderCriteriaRow(propsWithUndefinedColumns)).not.toThrow();
    });

    it('should render different filter values correctly', () => {
      const differentFilter = createMockFilter({
        leftCondition: 'column2',
        operator: Operator.GT,
        value: '100'
      });

      renderCriteriaRow({ ...defaultProps, filter: differentFilter });

      expect(screen.getByDisplayValue('column2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty columns array', () => {
      renderCriteriaRow({ ...defaultProps, columns: [] });

      const select = screen.getByLabelText('Left Condition');
      fireEvent.mouseDown(select);

      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('should handle null filter values', () => {
      const filterWithNullValues = createMockFilter({
        leftCondition: '',
        value: ''
      });

      expect(() =>
        renderCriteriaRow({ ...defaultProps, filter: filterWithNullValues })
      ).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels for all interactive elements', () => {
      renderCriteriaRow();

      expect(screen.getByLabelText('Left Condition')).toBeInTheDocument();
      expect(screen.getByLabelText('Operator')).toBeInTheDocument();
      expect(screen.getByLabelText('Value')).toBeInTheDocument();
      expect(screen.getByLabelText('Add')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove')).toBeInTheDocument();
    });

    it('should have unique IDs for form elements', () => {
      renderCriteriaRow();

      expect(document.getElementById('left-condition-0-0')).toBeInTheDocument();
      expect(document.getElementById('operator-0-0')).toBeInTheDocument();
      expect(document.getElementById('value-0-0')).toBeInTheDocument();
    });
  });
});
