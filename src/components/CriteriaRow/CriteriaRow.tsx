import React, { useMemo } from 'react';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography
} from '@mui/material';

import { useCriteriaRow } from 'hooks';
import { retrieveOperatorValue } from 'utils';
import { Filter, Operator } from 'types';

const styles = {
  container: {
    display: 'inline-flex',
    columnGap: 2,
    width: '100%'
  },
  orConnector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orText: {
    color: '#0969da',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: '15px',
    marginRight: '10px',
    fontSize: '20px'
  },
  formContainer: {
    flexGrow: 1
  },
  gridContainer: {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: 'repeat(3, 1fr)'
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderContainer: {
    width: '100%',
    mt: 2,
    mb: 2
  }
};

interface Props {
  filter: Filter;
  criteriaListIndex: number;
  filterIndex: number;
  columns: string[] | undefined;
  changeLeftCondition: (index: number, leftCondition: string) => void;
  changeOperator: (index: number, operator: Operator) => void;
  changeValue: (index: number, value: string) => void;
  addCriteria: (index: number) => void;
  removeCriteria: (index: number) => void;
  loading: boolean;
}

const CriteriaRow: React.FC<Props> = (props: Props) => {
  const {
    filter,
    criteriaListIndex,
    filterIndex,
    columns,
    addCriteria,
    removeCriteria,
    loading
  } = props;

  const {
    error,
    placeholder,
    changeLeftCondition,
    changeOperator,
    changeValue,
    addHover,
    addLeave,
    handleAdd,
    handleRemove
  } = useCriteriaRow({
    filter,
    filterIndex,
    changeLeftCondition: props.changeLeftCondition,
    changeOperator: props.changeOperator,
    changeValue: props.changeValue,
    addCriteria,
    removeCriteria
  });

  const index = `${criteriaListIndex}-${filterIndex}`;

  const LeftConditionSelect = useMemo(
    () => (
      <FormControl margin="normal" fullWidth>
        {loading ? (
          <Skeleton variant="rectangular" height={56} />
        ) : (
          <>
            <InputLabel id={`left-condition-label-${index}`}>
              Left Condition
            </InputLabel>
            <Select
              labelId={`left-condition-label-${index}`}
              id={`left-condition-${index}`}
              value={filter.leftCondition}
              label="Left Condition"
              onChange={changeLeftCondition}
            >
              {columns &&
                columns.map((column) => (
                  <MenuItem
                    key={`left-condition-option-${index}-${column}`}
                    value={column}
                  >
                    {column}
                  </MenuItem>
                ))}
            </Select>
          </>
        )}
      </FormControl>
    ),
    [loading, index, filter.leftCondition, changeLeftCondition, columns]
  );

  const OperatorSelect = useMemo(
    () => (
      <FormControl margin="normal" fullWidth>
        {loading ? (
          <Skeleton variant="rectangular" height={56} />
        ) : (
          <>
            <InputLabel id={`operator-label-${index}`}>Operator</InputLabel>
            <Select
              labelId={`operator-label-${index}`}
              id={`operator-${index}`}
              value={retrieveOperatorValue(Operator, filter.operator)}
              label="Operator"
              onChange={changeOperator}
            >
              {Object.keys(Operator).map((key) => (
                <MenuItem key={`operator-option-${index}-${key}`} value={key}>
                  {Operator[key as keyof typeof Operator]}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </FormControl>
    ),
    [loading, index, filter.operator, changeOperator]
  );

  const ValueTextField = useMemo(
    () => (
      <FormControl margin="normal" fullWidth>
        {loading ? (
          <Skeleton variant="rectangular" height={56} />
        ) : (
          <TextField
            error={error ? true : false}
            helperText={error ? error : ''}
            id={`value-${index}`}
            label="Value"
            variant="outlined"
            value={filter.value}
            onChange={changeValue}
          />
        )}
      </FormControl>
    ),
    [loading, error, index, filter.value, changeValue]
  );

  const ActionButtons = useMemo(
    () => (
      <Box sx={styles.actionsContainer}>
        <Box onMouseEnter={addHover} onMouseLeave={addLeave}>
          {loading ? (
            <Skeleton variant="circular" width={48} height={48} />
          ) : (
            <IconButton
              color="primary"
              aria-label="Add"
              component="span"
              size="large"
              onClick={handleAdd}
            >
              <AddIcon />
            </IconButton>
          )}
        </Box>
        {loading ? (
          <Skeleton variant="circular" width={48} height={48} />
        ) : (
          <IconButton
            color="warning"
            aria-label="Remove"
            component="span"
            size="large"
            onClick={handleRemove}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    ),
    [loading, addHover, addLeave, handleAdd, handleRemove]
  );

  return (
    <Box className={`criteria-row criteria-row-${index}`}>
      <Box sx={styles.container}>
        {filterIndex >= 1 && (
          <Box sx={styles.orConnector}>
            <Typography sx={styles.orText}>OR</Typography>
          </Box>
        )}
        <Box sx={styles.formContainer}>
          <Box sx={styles.gridContainer}>
            {LeftConditionSelect}
            {OperatorSelect}
            {ValueTextField}
          </Box>
        </Box>
        {ActionButtons}
      </Box>
      {placeholder && (
        <Box sx={styles.placeholderContainer}>
          <Skeleton variant="rectangular" height={50} />
        </Box>
      )}
    </Box>
  );
};

export default CriteriaRow;
