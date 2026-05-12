'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useTenant } from '@/lib/tenant-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const { activeTenant } = useTenant();
  const router = useRouter();

  // If user already has a tenant, redirect to cockpit
  useEffect(() => {
    if (activeTenant) {
      router.push('/cockpit');
    }
  }, [activeTenant, router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-brand-dark mb-3">
              Welkom bij ClubPilot!
            </h1>
            <p className="text-lg text-gray-600">
              Laten we je in drie stappen aan de slag helpen.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {/* Step 1 */}
            <Card className="border-l-4 border-l-brand-primary bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-primary text-white font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <CardTitle>Maak je organisatie aan</CardTitle>
                    <CardDescription className="mt-1">
                      Dit duurt ongeveer 2 minuten. Je kunt dit later aanpassen.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/onboarding/create-organization">
                  <Button size="lg" className="gap-2">
                    Organisatie aanmaken <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-l-4 border-l-gray-300 opacity-50">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-300 text-white font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-gray-600">Vul je profiel in</CardTitle>
                    <CardDescription className="mt-1">
                      (Beschikbaar na stap 1)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Step 3 */}
            <Card className="border-l-4 border-l-gray-300 opacity-50">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-300 text-white font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-gray-600">Start met ClubPilot</CardTitle>
                    <CardDescription className="mt-1">
                      (Beschikbaar na stap 2)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <div className="text-blue-600 flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-sm text-blue-900">
              <strong>Pro tip:</strong> Je kunt later meer organisaties toevoegen en makkelijk tussen ze schakelen vanuit de zijbalk.
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
