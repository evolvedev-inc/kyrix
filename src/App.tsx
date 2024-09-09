import { Outlet, useBlocker, useLocation, useNavigate } from 'react-router-dom';
import { KyrixContextProvider, useKyrixContext } from '@kyrix/react/KyrixProvider';

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <KyrixContextProvider navigate={navigate} pathname={location.pathname}>
      <App />
    </KyrixContextProvider>
  );
}

export const App = () => {
  const { isNavigating, shouldBlock } = useKyrixContext();

  // This is needed to block the navigation before fetching the metadata
  // from server during client-side navigation. The navigation will be
  // resumed automatically as we have the route data available.
  useBlocker(({ nextLocation }) => shouldBlock(nextLocation.pathname));

  return (
    <main>
      {isNavigating && 'loading...'}
      <Outlet />
    </main>
  );
};
