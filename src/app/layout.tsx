'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './globals.css';

import Layout from '@/components/Layout';
import { KeycloakProvider } from '@/context/KeycloakContext';
import { PrimeReactProvider } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const toastRef = useRef(null);

  return (
    <html lang="en">
      <body>
        <PrimeReactProvider>
          <KeycloakProvider>
            <Toast ref={toastRef} />
            <Layout>{children}</Layout>
          </KeycloakProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}