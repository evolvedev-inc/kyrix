import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Providers } from './Providers.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Action from './Action.tsx';
import Home from './Home.tsx';

import './globals.css';

const routes = createBrowserRouter([
  {
    path: '/',
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={routes} />
    </Providers>
  </StrictMode>
);
