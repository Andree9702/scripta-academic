import React from 'react';
import { createRoot } from 'react-dom/client';
import SampleGenerator from '../components/SampleGenerator';

const container = document.getElementById('scripta-sample');
if (container) {
  createRoot(container).render(<SampleGenerator />);
}
