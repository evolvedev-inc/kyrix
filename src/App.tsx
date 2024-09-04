import { Outlet, useLocation } from 'react-router-dom';
import { KyrixContextProvider } from '@kyrix/react/KyrixProvider';

const App = () => {
  const location = useLocation();

  return (
    <KyrixContextProvider location={location.pathname}>
      <Outlet />
    </KyrixContextProvider>
  );
};

export default App;
