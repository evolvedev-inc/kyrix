import { createBrowserRouter } from 'react-router-dom';

import Root from './App';
import Home from './pages/Home';

export const routes = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
]);
