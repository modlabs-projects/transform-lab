import { type ReactNode } from 'react';
import Navigation from './Navigation';
import '../styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
  header?: string;
}

const Layout = ({ children, header }: LayoutProps) => {
  return (
    <div className="container">
      <Navigation />
      {header && <h1>{header}</h1>}
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
