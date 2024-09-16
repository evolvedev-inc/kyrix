import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Providers } from './Providers.tsx';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes.tsx';

import './globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={routes} />
    </Providers>
  </StrictMode>
);
