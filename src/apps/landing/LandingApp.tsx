import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../../shared/constants';

// Import pages
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

/**
 * Landing Application
 * Main landing page application for restaurant owners
 */
const LandingApp: React.FC = () => {
  return (
    <div className="landing-app">
      <Routes>
        <Route path={ROUTES.LANDING.HOME} element={<HomePage />} />
        <Route path={ROUTES.LANDING.PRICING} element={<PricingPage />} />
        <Route path={ROUTES.LANDING.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.LANDING.CONTACT} element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default LandingApp;