import React, { lazy, Suspense } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
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
  const { result } = useFilter();

  return (
    <>
      <UrlInput />
      {result.columns.length > 1 && <CriteriaBuilder />}
      {result.columns.length > 1 && <AndButton />}
      {result.columns.length > 1 && <ResultContainer />}
    </>
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
