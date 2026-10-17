import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { LanguageProvider } from '@/context/LanguageContext';
import {
  DashboardPage,
  FarmCarePage,
  IntelligencePage,
  FinancePage,
  MarketPage,
  ProfilePage,
  NotFoundPage,
} from '@/pages';

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="farm-care" element={<FarmCarePage />} />
            <Route path="intelligence" element={<IntelligencePage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
