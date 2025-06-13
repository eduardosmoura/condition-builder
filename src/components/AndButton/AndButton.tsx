import React, { useCallback, useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';

import { FilterContext } from 'contexts';
import { deepClone, generateId } from 'utils';
import { CriteriaList } from 'core';
import { Filter, Operator } from 'types';

const styles = {
  andButton: {
    width: '100px',
    height: '50px',
    margin: 0,
    fontSize: '14px',
    color: '#0969da',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    padding: '5px 10px'
  }
};

const AndButton: React.FC = () => {
  const filterContext = useContext(FilterContext);

  const handleAdd = useCallback(() => {
    if (!filterContext) {
      return;
    }

    const { setCriteriaGroup, criteriaGroup, result } = filterContext;

    const criteria: Filter = {
      leftCondition: result.columns[0] || '',
      operator: Operator.EQ,
      value: '',
      id: generateId()
    };
    const criteriaList = new CriteriaList();
    criteriaList.add(criteria);
    criteriaGroup.add(criteriaList);
    setCriteriaGroup(deepClone(criteriaGroup));
  }, [filterContext]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Button
        variant="outlined"
        onClick={handleAdd}
        startIcon={<AddIcon />}
        sx={styles.andButton}
        disabled={!filterContext}
      >
        And
      </Button>
    </Box>
  );
};

export default AndButton;
