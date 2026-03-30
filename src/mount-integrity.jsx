import React from 'react';
import { createRoot } from 'react-dom/client';
import IntegritySuite from '../components/IntegritySuite';

const container = document.getElementById('scripta-integrity');
if (container) {
  createRoot(container).render(<IntegritySuite />);
}
