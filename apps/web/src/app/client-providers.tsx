'use client';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';

const fetcher = (...args: any) => fetch(args).then((response) => response.json());

const ClientProviders = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig value={{ fetcher }}>
      <GeistProvider>
        <CssBaseline />
        {children}
      </GeistProvider>
    </SWRConfig>
  );
};

export { ClientProviders };