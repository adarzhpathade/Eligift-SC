import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth-cache';
import { getMyApplications } from '@/actions/applications';
import { cookies } from 'next/headers';
import { ApplicationsContent } from './ApplicationsContent';

export const metadata = {
  title: 'My Applications | Eligify',
  description: 'Track your scheme applications, view repayment progress, and manage your loan dossiers.',
};

export default async function MyApplicationsPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect('/login');
  }

  const [{ success, data: applications }, cookieStore] = await Promise.all([
    getMyApplications(),
    cookies(),
  ]);

  let apps = success && applications ? applications : [];

  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  if (locale === 'hi') {
    apps = apps.map((a) => ({
      ...a,
      schemeTitle: a.schemeTitleHi || a.schemeTitle,
      schemeMinistry: a.schemeMinistryHi || a.schemeMinistry,
    }));
  }

  return (
    <div className="py-12">
      <ApplicationsContent applications={apps} />
    </div>
  );
}
