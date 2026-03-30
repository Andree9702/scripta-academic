import React from 'react';
import { createRoot } from 'react-dom/client';
import ClientPortal from '../components/ClientPortal';

const container = document.getElementById('scripta-portal');
if (container) {
  createRoot(container).render(<ClientPortal />);
}
