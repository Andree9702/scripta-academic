import React from 'react';
import { createRoot } from 'react-dom/client';
import DiagnosticForm from '../components/DiagnosticForm';

const container = document.getElementById('scripta-diagnostic');
if (container) {
  createRoot(container).render(<DiagnosticForm />);
}
