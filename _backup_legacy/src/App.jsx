import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { JournalProvider } from './context/JournalContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Entries from './pages/Entries';
import Gallery from './pages/Gallery';

function App() {
  return (
    <JournalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="entries" element={<Entries />} />
            <Route path="gallery" element={<Gallery />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </JournalProvider>
  );
}

export default App;
