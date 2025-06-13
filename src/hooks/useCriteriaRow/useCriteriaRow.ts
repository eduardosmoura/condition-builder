import { SelectChangeEvent } from '@mui/material/Select';
import { useCallback, useState } from 'react';

import { Filter, Operator } from 'types';

interface Props {
  filter: Filter;
  filterIndex: number;
  changeLeftCondition: (index: number, leftCondition: string) => void;
  changeOperator: (index: number, operator: Operator) => void;
  changeValue: (index: number, value: string) => void;
  addCriteria: (index: number) => void;
  removeCriteria: (index: number) => void;
}

interface UseCriteriaRow {
  error: string | null;
  placeholder: boolean;
  changeLeftCondition: (event: SelectChangeEvent) => void;
  changeOperator: (event: SelectChangeEvent) => void;
  changeValue: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  addHover: () => void;
  addLeave: () => void;
  handleAdd: () => void;
  handleRemove: () => void;
}

export const useCriteriaRow = ({
  filter,
  filterIndex,
  changeLeftCondition: changeLeftConditionProp,
  changeOperator: changeOperatorProp,
  changeValue: changeValueProp,
  addCriteria,
  removeCriteria
}: Props): UseCriteriaRow => {
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState<boolean>(false);

  const checkNumericError = useCallback((filter: Filter, value: string) => {
    if (
      [Operator.GT, Operator.LT].includes(filter.operator) &&
      !/^-?\d*\.?\d*$/.test(value)
    ) {
      setError('Value must be numeric');
    } else {
      setError(null);
    }
  }, []);

  const changeLeftCondition = useCallback(
    (event: SelectChangeEvent): void => {
      const leftCondition: string = event.target.value;
      changeLeftConditionProp(filterIndex, leftCondition);
    },
    [filterIndex, changeLeftConditionProp]
  );

  const changeOperator = useCallback(
    (event: SelectChangeEvent): void => {
      const operator: string = event.target.value;
      setError(null);
      changeOperatorProp(
        filterIndex,
        Operator[operator as keyof typeof Operator]
      );
    },
    [filterIndex, changeOperatorProp]
  );

  const changeValue = useCallback(
    (
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void => {
      const value: string = event.target.value;
      checkNumericError(filter, value);
      changeValueProp(filterIndex, value);
    },
    [filterIndex, filter, changeValueProp, checkNumericError]
  );

  const addHover = useCallback((): void => {
    setPlaceholder(true);
  }, []);

  const addLeave = useCallback((): void => {
    setPlaceholder(false);
  }, []);

  const handleAdd = useCallback((): void => {
    setPlaceholder(false);
    addCriteria(filterIndex);
  }, [filterIndex, addCriteria]);

  const handleRemove = useCallback((): void => {
    removeCriteria(filterIndex);
  }, [filterIndex, removeCriteria]);

  return {
    error,
    placeholder,
    changeLeftCondition,
    changeOperator,
    changeValue,
    addHover,
    addLeave,
    handleAdd,
    handleRemove
  };
};
