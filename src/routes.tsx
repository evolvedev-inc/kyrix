import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import Home from './pages/Home';
import Action from './pages/Action';

export const routes = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/action',
        element: <Action />,
      },
    ],
  },
]);
