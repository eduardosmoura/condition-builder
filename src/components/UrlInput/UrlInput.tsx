import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, FormControl } from '@mui/material';

import { useFilter } from 'contexts';
import { UrlService } from 'services';
import { deepClone, generateId, isUrl } from 'utils';
import { CriteriaList } from 'core';
import { Filter, Operator } from 'types';
import {
  API_BASE_URL,
  EMPTY_CRITERIA_GROUP,
  EMPTY_RESULT,
  HELPER_TEXT,
  LOADING_DELAY
} from 'utils/constants';

const styles = {
  container: {
    mb: 4
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2
  }
};

const UrlInput: React.FC = () => {
  const { setResult, criteriaGroup, setCriteriaGroup, loading, setLoading } =
    useFilter();
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>(API_BASE_URL);

  const loadDataFromUrl = useCallback(
    async (targetUrl: string) => {
      if (loading) {
        return;
      }
      try {
        setLoading(true);
        setError(null);
        criteriaGroup.clear();
        const urlService = new UrlService(targetUrl);
        const data = await urlService.fetchResult();
        setResult(data);
        const criteria: Filter = {
          leftCondition: data.columns[0],
          operator: Operator.EQ,
          value: '',
          id: generateId()
        };
        const criteriaList = new CriteriaList();
        criteriaList.add(criteria);
        criteriaGroup.add(criteriaList);
        setCriteriaGroup(deepClone(criteriaGroup));
      } catch (error) {
        setResult(EMPTY_RESULT);
        setCriteriaGroup(EMPTY_CRITERIA_GROUP);
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, LOADING_DELAY);
      }
    },
    [loading, setLoading, criteriaGroup, setResult, setCriteriaGroup]
  );

  useEffect(() => {
    loadDataFromUrl(API_BASE_URL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setUrl(event.target.value.trim());
    },
    []
  );

  const handleUrlEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Enter') {
        if (!isUrl(url)) {
          setResult(EMPTY_RESULT);
          setCriteriaGroup(EMPTY_CRITERIA_GROUP);
          setError('URL is invalid.');
          return;
        }
        loadDataFromUrl(url);
      }
    },
    [url, loadDataFromUrl, setResult, setCriteriaGroup]
  );

  return (
    <Box sx={styles.container}>
      <Box sx={styles.inputContainer}>
        <FormControl fullWidth>
          <TextField
            id="url"
            name="url"
            label="Url"
            defaultValue={url}
            error={!!error}
            helperText={error ?? HELPER_TEXT}
            onChange={handleUrlChange}
            onKeyPress={handleUrlEnter}
            disabled={loading}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default UrlInput;
