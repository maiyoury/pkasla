interface CorporateProfessionalTemplateProps {
  event: {
    title: string;
    description?: string;
    date: string | Date;
    venue: string;
    googleMapLink?: string;
    coverImage?: string;
  };
  guest: {
    name: string;
    email?: string;
    company?: string;
    inviteToken?: string;
    meta?: Record<string, string>;
  };
  assets: {
    images?: Record<string, string>;
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
  };
}

export default function CorporateProfessionalTemplate({ event, guest, assets }: CorporateProfessionalTemplateProps) {
  const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const primaryColor = assets.colors?.primary || '#1E3A8A';
  const secondaryColor = assets.colors?.secondary || '#3B82F6';
  const accentColor = assets.colors?.accent || '#64748B';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl w-full bg-white shadow-xl">
        {/* Professional Header */}
        <div
          className="py-12 px-8 text-center border-b-4"
          style={{ borderColor: primaryColor }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: primaryColor }}>
            {event.title}
          </h1>
          <div className="w-32 h-1 mx-auto mt-4" style={{ backgroundColor: secondaryColor }}></div>
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 py-10">
          {/* Greeting */}
          <div className="mb-8">
            <p className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              Dear {guest.name}
              {guest.company && (
                <span className="text-base font-normal text-gray-600"> from {guest.company}</span>
              )}
              ,
            </p>
            {event.description && (
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                {event.description}
              </p>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-6 mb-8 border-t border-b py-8" style={{ borderColor: '#E5E7EB' }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                  Date
                </p>
                <p className="text-lg font-semibold text-gray-800">{formattedDate}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                  Time
                </p>
                <p className="text-lg font-semibold text-gray-800">{formattedTime}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                Location
              </p>
              <p className="text-lg font-semibold text-gray-800">{event.venue}</p>
              {event.googleMapLink && (
                <a
                  href={event.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm mt-2 inline-block font-medium underline"
                  style={{ color: primaryColor }}
                >
                  View on Map
                </a>
              )}
            </div>
          </div>

          {/* RSVP Button */}
          <div className="text-center mt-10">
            <a
              href={`/invite/${guest.inviteToken || ''}/rsvp`}
              className="inline-block px-8 py-3 text-white font-semibold rounded transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              Confirm Attendance
            </a>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>We look forward to your participation</p>
            {guest.email && (
              <p className="mt-2 text-xs text-gray-500">For inquiries: {guest.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

