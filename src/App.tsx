import { Outlet, useNavigate } from 'react-router-dom';
import { KyrixContextProvider } from '@kyrix/react/KyrixProvider';

const App = () => {
  const navigate = useNavigate();

  return (
    <KyrixContextProvider navigate={navigate}>
      <Outlet />
    </KyrixContextProvider>
  );
};

export default App;
