import React from 'react';
import { createRoot } from 'react-dom/client';
import VirtualCommittee from '../components/VirtualCommittee';

const container = document.getElementById('scripta-committee');
if (container) {
  createRoot(container).render(<VirtualCommittee />);
}
