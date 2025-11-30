interface ElegantRoseTemplateProps {
  event: {
    title: string;
    description?: string;
    date: string | Date;
    venue: string;
    googleMapLink?: string;
    coverImage?: string;
    dressCode?: string;
  };
  guest: {
    name: string;
    email?: string;
    inviteToken?: string;
    meta?: Record<string, string>;
  };
  assets: {
    images?: Record<string, string>;
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
  };
}

export default function ElegantRoseTemplate({ event, guest, assets }: ElegantRoseTemplateProps) {
  const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const primaryColor = assets.colors?.primary || '#E91E63';
  const secondaryColor = assets.colors?.secondary || '#C2185B';
  const accentColor = assets.colors?.accent || '#F8BBD0';
  const roseColor = assets.colors?.rose || '#FF69B4';
  const backgroundImage = assets.images?.background || event.coverImage || '';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #f48fb1 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-2xl w-full bg-white/98 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Decorative Rose Pattern Header */}
        <div
          className="relative py-12 px-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-10">
            {assets.images?.['rose-pattern'] && (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${assets.images['rose-pattern']})`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '200px',
                }}
              />
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white relative z-10 mb-2">
            {event.title}
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 py-10">
          {/* Greeting */}
          <div className="text-center mb-8">
            <p className="text-xl md:text-2xl text-gray-800 mb-3 font-serif">
              Dear {guest.name},
            </p>
            {event.description && (
              <p className="text-base md:text-lg text-gray-700 leading-relaxed italic">
                {event.description}
              </p>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-6 mb-8">
            <div className="text-center py-6 border-y-2" style={{ borderColor: accentColor }}>
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                Date
              </p>
              <p className="text-2xl font-serif text-gray-800">{formattedDate}</p>
            </div>

            <div className="text-center py-6">
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                Venue
              </p>
              <p className="text-xl font-serif text-gray-800">{event.venue}</p>
              {event.googleMapLink && (
                <a
                  href={event.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm mt-3 inline-block underline"
                  style={{ color: primaryColor }}
                >
                  View on Map
                </a>
              )}
            </div>

            {event.dressCode && (
              <div className="text-center py-4 bg-pink-50 rounded-lg">
                <p className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: secondaryColor }}>
                  Dress Code
                </p>
                <p className="text-lg font-serif" style={{ color: primaryColor }}>
                  {event.dressCode}
                </p>
              </div>
            )}
          </div>

          {/* Decorative Border */}
          {assets.images?.['border'] && (
            <div className="my-8">
              <img
                src={assets.images.border}
                alt=""
                className="w-full h-auto opacity-60"
              />
            </div>
          )}

          {/* RSVP Button */}
          <div className="text-center mt-10">
            <a
              href={`/invite/${guest.inviteToken || ''}/rsvp`}
              className="inline-block px-10 py-4 text-white font-semibold rounded-full transition-all hover:opacity-90 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              }}
            >
              RSVP
            </a>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm italic text-gray-600">
            <p>We look forward to celebrating with you!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

