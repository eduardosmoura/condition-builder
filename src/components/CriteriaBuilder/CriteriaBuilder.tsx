import React from 'react';
import { Box } from '@mui/material';

import CriteriaGroup from 'components/CriteriaGroup/CriteriaGroup';
import { useFilter } from 'contexts';
import { CriteriaList } from 'core';

const CriteriaBuilder: React.FC = () => {
  const {
    result: { columns },
    criteriaGroup
  } = useFilter();

  return (
    <Box>
      {criteriaGroup &&
        criteriaGroup.all().map((criteriaList: CriteriaList, index: number) => {
          return (
            <CriteriaGroup
              key={index}
              criteriaList={criteriaList}
              criteriaListIndex={index}
              columns={columns}
            />
          );
        })}
    </Box>
  );
};

export default CriteriaBuilder;
