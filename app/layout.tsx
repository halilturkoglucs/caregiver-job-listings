// app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
    <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
    </head>
    <body>
      {children}
    </body>
    </html>
  );
};

export default RootLayout;
