import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SKELETON_ROWS_COUNT } from 'utils';

const styles = {
  container: {
    height: 630,
    width: '100%',
    marginBottom: '100px'
  },
  loadingContainer: {
    height: 'max-content'
  },
  dataGrid: {
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold'
    }
  }
};

interface Props {
  rows: object[];
  columns: string[];
  loading: boolean;
}

const ResultTable: React.FC<Props> = ({ columns, rows, loading }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100
  });

  const attributes: GridColDef[] = [];
  columns.map((column) => {
    attributes.push({
      field: column,
      headerName: column,
      sortable: true,
      valueGetter: (value, row) => {
        return typeof row[column] === 'object'
          ? JSON.stringify(row[column])
          : row[column];
      }
    });
  });

  return (
    <Box sx={styles.container}>
      {loading ? (
        <Box sx={styles.loadingContainer}>
          {[...Array(SKELETON_ROWS_COUNT)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" sx={{ my: 2, mx: 1 }} />
          ))}
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          loading={loading}
          sx={styles.dataGrid}
          columns={attributes}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50, 75, 100]}
          checkboxSelection={false}
          pagination
        />
      )}
    </Box>
  );
};

export default ResultTable;
