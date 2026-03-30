import React from 'react';
import { createRoot } from 'react-dom/client';
import ManuscriptDiagnostic from '../components/ManuscriptDiagnostic';

const container = document.getElementById('scripta-manuscript');
if (container) {
  createRoot(container).render(<ManuscriptDiagnostic />);
}
