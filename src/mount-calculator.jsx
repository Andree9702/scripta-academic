import React from 'react';
import { createRoot } from 'react-dom/client';
import PriceCalculator from '../components/PriceCalculator';

const container = document.getElementById('scripta-calculator');
if (container) {
  createRoot(container).render(<PriceCalculator />);
}
