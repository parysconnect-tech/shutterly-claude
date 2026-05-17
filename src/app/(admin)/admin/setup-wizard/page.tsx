import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { wizardSteps } from '@/content/wizard-steps';
import { WizardClient } from '@/components/wizard/WizardClient';

export default async function WizardPage({ searchParams }: { searchParams: { step?: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user) redirect('/signin?callbackUrl=/admin/setup-wizard');
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') redirect('/dashboard');

  const userId = (session.user as any).id as string;
  const state = await prisma.adminWizardState.upsert({
    where: { userId },
    update: {},
    create: { userId, currentStep: 0, payload: '{}' }
  }).catch(() => null);

  if (state?.completed) {
    // Allow re-entry via ?force=1
    if (!searchParams.step) redirect('/admin');
  }

  const initialStep = state?.currentStep ?? 0;
  const initialPayload = (() => {
    try { return JSON.parse(state?.payload ?? '{}'); } catch { return {}; }
  })();

  return (
    <WizardClient
      steps={wizardSteps}
      initialStep={initialStep}
      initialPayload={initialPayload}
      completed={!!state?.completed}
    />
  );
}
