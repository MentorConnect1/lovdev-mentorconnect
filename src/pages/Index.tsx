import React from 'react';
import { useAppStore } from '@/store/appStore';
import LandingPage from '@/components/LandingPage';
import LoginPage from '@/components/LoginPage';
import SignupFlow from '@/components/SignupFlow';
import AppShell from '@/components/AppShell';
import PhoneViewWrapper from '@/components/PhoneViewWrapper';

const Index = () => {
  const activePage = useAppStore(s => s.activePage);
  const currentUser = useAppStore(s => s.currentUser);

  const content = (() => {
    if (!currentUser) {
      switch (activePage) {
        case 'login': return <LoginPage />;
        case 'signup': return <SignupFlow />;
        default: return <LandingPage />;
      }
    }
    return <AppShell />;
  })();

  return <PhoneViewWrapper>{content}</PhoneViewWrapper>;
};

export default Index;
