/* eslint-disable react-hooks/error-boundaries */
import { notFound, redirect } from 'next/navigation';
import { api } from '@/lib/axios-client';

interface InvitePageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ preview?: string }>;
}

interface InviteRenderData {
  event: any;
  guest: any;
  template: any;
  assets: {
    images: Record<string, string>;
    colors: Record<string, string>;
    fonts: Record<string, string>;
  };
}

/**
 * Public invitation page
 * Fetches guest and event data by token and renders the selected template
 */
export default async function InvitePage({ params, searchParams }: InvitePageProps) {
  const { token } = await params;
  const resolvedSearchParams = await searchParams;
  const isPreview = resolvedSearchParams.preview === 'true';

  try {
    // Fetch invitation data from backend
    const response = await api.get<InviteRenderData>(`/invites/${token}`);
    
    if (!response.success || !response.data) {
      console.error('Invite API response failed:', {
        success: response.success,
        error: response.error,
        message: response.message,
      });
      notFound();
    }

    const { event, guest, template, assets } = response.data;

    if (!event || !guest) {
      console.error('Missing event or guest data:', {
        hasEvent: !!event,
        hasGuest: !!guest,
        data: response.data,
      });
      notFound();
    }

    // If no template is selected, show a default message
    if (!template || !template.slug) {
      console.warn('No template selected for event:', {
        eventId: event.id || event._id,
        eventTitle: event.title,
        template: template,
      });
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-gray-600">No template selected for this event.</p>
          </div>
        </div>
      );
    }

    // Build query params for template route
    // Include token in guest data for RSVP links
    const guestWithToken = { ...guest, inviteToken: token };
    const templateParams = new URLSearchParams({
      event: JSON.stringify(event),
      guest: JSON.stringify(guestWithToken),
      assets: JSON.stringify(assets),
    });

    // Redirect to the appropriate template route
    if (template.slug) {
      redirect(`/templates/base/${template.slug}?${templateParams.toString()}`);
    }

    console.error('Template slug is missing:', { template });
    notFound();
  } catch (error: any) {
    // Next.js redirect() throws a special error that we need to re-throw
    // Check if this is a redirect error (NEXT_REDIRECT)
    // Next.js redirect errors have a digest that starts with 'NEXT_REDIRECT'
    if (
      error?.message === 'NEXT_REDIRECT' ||
      error?.digest?.startsWith('NEXT_REDIRECT') ||
      (error?.name === 'Error' && error?.message?.includes('NEXT_REDIRECT'))
    ) {
      throw error; // Re-throw redirect errors so Next.js can handle them
    }

    // Only log and show not-found for actual errors, not redirects
    console.error('Failed to load invitation:', {
      error: error?.message || error,
      errorType: error?.constructor?.name,
      response: error?.response?.data,
      status: error?.response?.status,
      token,
    });
    notFound();
  }
}

