import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';

import ResultTable from 'components/ResultTable/ResultTable';
import { useFilter } from 'contexts';
import { CriteriaSearch } from 'core';

const styles = {
  title: {
    textAlign: 'left',
    mt: 6,
    mb: 1,
    fontWeight: 'bold'
  },
  chipStack: {
    mb: 4
  }
};

const ResultContainer: React.FC = () => {
  const { result, criteriaGroup, loading } = useFilter();
  const criteriaSearch = new CriteriaSearch(result.data, criteriaGroup);
  const filteredData = criteriaSearch.search();

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={styles.title}>
        Result
      </Typography>
      <Stack direction="row" spacing={1} sx={styles.chipStack}>
        <Chip
          label={loading ? 'Total: -' : `Total: ${result.data.length}`}
          color="default"
        />
        <Chip
          label={loading ? 'Filtered: -' : `Filtered: ${filteredData.length}`}
          color="primary"
        />
      </Stack>
      <ResultTable
        columns={result.columns}
        rows={filteredData}
        loading={loading}
      />
    </Box>
  );
};

export default ResultContainer;
