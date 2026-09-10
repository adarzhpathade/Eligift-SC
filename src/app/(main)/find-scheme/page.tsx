import React from 'react';
import { getSavedSchemeIds } from '@/actions/saved-schemes';
import { FindSchemeClient } from '@/components/find-scheme/FindSchemeClient';

export const metadata = {
  title: 'Find Me Scheme | Eligify',
  description: 'Use our AI assistant to find the best government schemes for your situation.',
};

export const dynamic = 'force-dynamic';

export default async function FindSchemePage() {
  const { data: savedSchemeIds } = await getSavedSchemeIds();

  return (
    <div className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] min-h-[calc(100vh-72px)] md:h-[calc(100vh-72px)] -mt-8 overflow-y-auto md:overflow-hidden bg-background flex flex-col">
      <FindSchemeClient initialSavedSchemeIds={savedSchemeIds} />
    </div>
  );
}
