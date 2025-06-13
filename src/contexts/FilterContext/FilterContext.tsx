import React, { createContext, useContext, useState, ReactNode } from 'react';

import { CriteriaGroup } from 'core';
import { Result } from 'types';
import { EMPTY_CRITERIA_GROUP, EMPTY_RESULT } from 'utils';

interface FilterContextType {
  result: Result;
  setResult: (data: Result) => void;
  criteriaGroup: CriteriaGroup;
  setCriteriaGroup: (criteriaGroup: CriteriaGroup) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined
);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [result, setResult] = useState<Result>(EMPTY_RESULT);
  const [criteriaGroup, setCriteriaGroup] =
    useState<CriteriaGroup>(EMPTY_CRITERIA_GROUP);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <FilterContext.Provider
      value={{
        result,
        setResult,
        criteriaGroup,
        setCriteriaGroup,
        loading,
        setLoading
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
