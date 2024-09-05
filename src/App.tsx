import { Outlet, useLocation } from 'react-router-dom';
import { KyrixContextProvider } from '@kyrix/react/KyrixProvider';

export default function Root() {
  const location = useLocation();

  return (
    <KyrixContextProvider location={location.pathname}>
      <App />
    </KyrixContextProvider>
  );
}

export const App = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};
