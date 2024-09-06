import { Outlet, useLocation } from 'react-router-dom';
import { KyrixContextProvider, useKyrixContext } from '@kyrix/react/KyrixProvider';

export default function Root() {
  const location = useLocation();

  return (
    <KyrixContextProvider location={location.pathname}>
      <App />
    </KyrixContextProvider>
  );
}

export const App = () => {
  const { isNavigating } = useKyrixContext();

  return (
    <main>
      {isNavigating && 'loading...'}
      <Outlet />
    </main>
  );
};
