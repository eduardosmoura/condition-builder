import { useCallback, useMemo } from 'react';

import { useNotification } from 'contexts';
import { CriteriaGroup, CriteriaList } from 'core';
import { Filter, Operator, Result } from 'types';
import { deepClone, generateId } from 'utils';

interface Props {
  criteriaList: CriteriaList;
  criteriaListIndex: number;
  result: Result;
  criteriaGroup: CriteriaGroup;
  setCriteriaGroup: (criteriaGroup: CriteriaGroup) => void;
}

interface UseCriteriaGroup {
  filters: Filter[];
  hasFilters: boolean;
  changeLeftCondition: (index: number, leftCondition: string) => void;
  changeOperator: (index: number, operator: Operator) => void;
  changeValue: (index: number, value: string) => void;
  addCriteria: (index: number) => void;
  removeCriteria: (index: number) => void;
}

export const useCriteriaGroup = ({
  criteriaList,
  criteriaListIndex,
  result,
  criteriaGroup,
  setCriteriaGroup
}: Props): UseCriteriaGroup => {
  const { showError, showWarning } = useNotification();

  const updateFilterGroup = useCallback(() => {
    try {
      const clonedFilterGroup = deepClone(criteriaGroup);
      setCriteriaGroup(clonedFilterGroup);
    } catch (error) {
      showError('Error updating filter group. Please try again.');
    }
  }, [criteriaGroup, setCriteriaGroup, showError]);

  const updateFilter = useCallback(
    (index: number, updateFn: (filter: Filter) => void) => {
      try {
        const filter = criteriaList.get(index);
        if (!filter) {
          showWarning(`Filter at index ${index} not found`);
          return;
        }

        updateFn(filter);
        criteriaList.set(index, filter);
        criteriaGroup.set(criteriaListIndex, criteriaList);
        updateFilterGroup();
      } catch (error) {
        showError('Error updating filter. Please try again.');
      }
    },
    [
      criteriaList,
      criteriaGroup,
      criteriaListIndex,
      updateFilterGroup,
      showWarning,
      showError
    ]
  );

  const changeLeftCondition = useCallback(
    (index: number, leftCondition: string) => {
      updateFilter(index, (filter) => {
        filter.leftCondition = leftCondition;
      });
    },
    [updateFilter]
  );

  const changeOperator = useCallback(
    (index: number, operator: Operator) => {
      updateFilter(index, (filter) => {
        filter.operator = operator;
      });
    },
    [updateFilter]
  );

  const changeValue = useCallback(
    (index: number, value: string) => {
      updateFilter(index, (filter) => {
        filter.value = value;
      });
    },
    [updateFilter]
  );

  const addCriteria = useCallback(
    (index: number) => {
      try {
        if (!result.columns || result.columns.length === 0) {
          showWarning('No columns available to create new filter');
          return;
        }

        const newFilter: Filter = {
          leftCondition: result.columns[0],
          operator: Operator.EQ,
          value: '',
          id: generateId()
        };

        criteriaList.insert(index, newFilter);
        criteriaGroup.set(criteriaListIndex, criteriaList);
        updateFilterGroup();
      } catch (error) {
        showError('Error adding condition row. Please try again.');
      }
    },
    [
      result.columns,
      criteriaList,
      criteriaGroup,
      criteriaListIndex,
      updateFilterGroup,
      showWarning,
      showError
    ]
  );

  const removeCriteria = useCallback(
    (index: number) => {
      try {
        criteriaList.remove(index);
        criteriaGroup.set(criteriaListIndex, criteriaList);

        if (criteriaList.size() === 0) {
          criteriaGroup.remove(criteriaListIndex);
        }

        updateFilterGroup();
      } catch (error) {
        showError('Error removing condition row. Please try again.');
      }
    },
    [
      criteriaList,
      criteriaGroup,
      criteriaListIndex,
      updateFilterGroup,
      showError
    ]
  );

  const filters = useMemo(() => criteriaList.all(), [criteriaList]);
  const hasFilters = useMemo(() => filters && filters.length > 0, [filters]);

  return {
    filters,
    hasFilters,
    changeLeftCondition,
    changeOperator,
    changeValue,
    addCriteria,
    removeCriteria
  };
};
