import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { LanguageProvider } from '@/context/LanguageContext';
import {
  DashboardPage,
  FarmCarePage,
  DiseaseScannerPage,
  IntelligencePage,
  WeatherPage,
  KhetScorePage,
  FinancePage,
  SchemesPage,
  MarketPage,
  MandiRatesPage,
  ProfilePage,
  NoDistressSellingPage,
  NotFoundPage,
} from '@/pages';

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* 11 Core Agricultural Feature Routes + Signature No Distress Selling */}
            <Route index element={<DashboardPage />} />
            <Route path="no-distress-selling" element={<NoDistressSellingPage />} />
            <Route path="distress-selling" element={<NoDistressSellingPage />} />
            <Route path="farm-care" element={<FarmCarePage />} />
            <Route path="disease-scanner" element={<DiseaseScannerPage />} />
            <Route path="crop-doctor" element={<DiseaseScannerPage />} />
            <Route path="intelligence" element={<IntelligencePage />} />
            <Route path="weather" element={<WeatherPage />} />
            <Route path="khet-score" element={<KhetScorePage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="schemes" element={<SchemesPage />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="mandi-rates" element={<MandiRatesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
