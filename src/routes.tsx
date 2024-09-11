import { createBrowserRouter } from 'react-router-dom';

import Root from './App';
import Home from './pages/Home';
import Action from './pages/Action';

export const routes = createBrowserRouter([
  {
    element: <Root />,
    errorElement: 'Some error happend',
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/action',
        element: <Action />,
      },
      {
        path: '/test/:testId',
        element: 'Test Page',
      },
    ],
  },
]);
