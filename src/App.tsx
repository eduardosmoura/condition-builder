import React, { lazy, Suspense, useMemo } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Fade,
  Stack
} from '@mui/material';
import {
  FilterProvider,
  useFilter
} from './contexts/FilterContext/FilterContext';
import { NotificationProvider } from './contexts/NotificationContext/NotificationContext';
import './styles/index.css';

const UrlInput = lazy(() => import('./components/UrlInput/UrlInput'));
const CriteriaBuilder = lazy(
  () => import('./components/CriteriaBuilder/CriteriaBuilder')
);
const ResultContainer = lazy(
  () => import('./components/ResultContainer/ResultContainer')
);
const AndButton = lazy(() => import('components/AndButton/AndButton'));

const MainContainer: React.FC = () => {
  const { result, loading } = useFilter();

  const hasData = useMemo(() => {
    return result?.data && Array.isArray(result.data) && result.data.length > 0;
  }, [result]);

  const canShowResults = useMemo(() => {
    return !loading && hasData;
  }, [loading, hasData]);

  const shouldShowEmptyState = useMemo(() => {
    return !loading && !hasData && result !== undefined;
  }, [loading, hasData, result]);

  return (
    <Box>
      <UrlInput />

      {loading && (
        <Fade in={loading}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={4}
            role="status"
            aria-live="polite"
          >
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Loading data...
              </Typography>
            </Stack>
          </Box>
        </Fade>
      )}

      {canShowResults && (
        <Fade in={canShowResults}>
          <Box>
            <CriteriaBuilder />
            <AndButton />
            <ResultContainer />
          </Box>
        </Fade>
      )}

      {shouldShowEmptyState && (
        <Fade in={shouldShowEmptyState}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={8}
            role="status"
            aria-live="polite"
          >
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ fontStyle: 'italic' }}
            >
              No data available. Please provide a valid url with data.
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <FilterProvider>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h3"
            fontWeight="bold"
            textAlign="left"
            pt={4}
            pb={4}
          >
            Condition Builder
          </Typography>
          <Suspense
            fallback={
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
              >
                <CircularProgress />
              </Box>
            }
          >
            <MainContainer />
          </Suspense>
        </Container>
      </FilterProvider>
    </NotificationProvider>
  );
};

export default App;
