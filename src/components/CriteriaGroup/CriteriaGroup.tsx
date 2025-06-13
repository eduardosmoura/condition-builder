import React, { useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';

import CriteriaRow from 'components/CriteriaRow/CriteriaRow';
import { useFilter } from 'contexts';
import { useCriteriaGroup } from 'hooks';
import { CriteriaList } from 'core';
import { Filter } from 'types';

const styles = {
  paper: {
    p: 2,
    minHeight: 60,
    display: 'flex',
    flexDirection: 'column',
    gap: 1
  },
  emptyPaper: {
    p: 1,
    minHeight: 60,
    display: 'flex',
    flexDirection: 'column',
    gap: 1
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
};

interface Props {
  criteriaList: CriteriaList;
  criteriaListIndex: number;
  columns: string[] | undefined;
}

const CriteriaGroup: React.FC<Props> = ({
  criteriaList,
  criteriaListIndex,
  columns
}: Props) => {
  const { result, criteriaGroup, loading, setCriteriaGroup } = useFilter();

  const {
    filters,
    hasFilters,
    changeLeftCondition,
    changeOperator,
    changeValue,
    addCriteria,
    removeCriteria
  } = useCriteriaGroup({
    criteriaList,
    criteriaListIndex,
    result,
    criteriaGroup,
    setCriteriaGroup
  });

  const CriteriaRows = useMemo(() => {
    if (!filters || filters.length === 0) return null;

    return filters.map((filter: Filter, index: number) => (
      <CriteriaRow
        key={filter.id}
        filter={filter}
        criteriaListIndex={criteriaListIndex}
        filterIndex={index}
        columns={columns}
        changeLeftCondition={changeLeftCondition}
        changeOperator={changeOperator}
        changeValue={changeValue}
        addCriteria={addCriteria}
        removeCriteria={removeCriteria}
        loading={loading}
      />
    ));
  }, [
    filters,
    criteriaListIndex,
    columns,
    changeLeftCondition,
    changeOperator,
    changeValue,
    addCriteria,
    removeCriteria,
    loading
  ]);

  return (
    <Box className="criteria-group-container">
      <Typography className="and-button" variant="body2" color="text.secondary">
        AND
      </Typography>
      <Paper
        elevation={2}
        className={`criteria-group criteria-group-${criteriaListIndex}`}
        sx={hasFilters ? styles.paper : styles.emptyPaper}
      >
        {hasFilters ? (
          CriteriaRows
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={styles.emptyState}
          >
            No criteria
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default CriteriaGroup;
