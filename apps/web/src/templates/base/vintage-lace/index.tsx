interface VintageLaceTemplateProps {
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
    inviteToken?: string;
    meta?: Record<string, string>;
  };
  assets: {
    images?: Record<string, string>;
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
  };
}

export default function VintageLaceTemplate({ event, guest, assets }: VintageLaceTemplateProps) {
  const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const primaryColor = assets.colors?.primary || '#8B7355';
  const secondaryColor = assets.colors?.secondary || '#6B5B4A';
  const creamColor = assets.colors?.cream || '#F5F5DC';
  const backgroundImage = assets.images?.background || event.coverImage || '';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : `linear-gradient(135deg, ${creamColor} 0%, #E8E8D8 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border-4" style={{ borderColor: primaryColor }}>
        {/* Lace Pattern Header */}
        {assets.images?.['lace-pattern'] && (
          <div
            className="h-24 w-full opacity-30"
            style={{
              backgroundImage: `url(${assets.images['lace-pattern']})`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'contain',
            }}
          />
        )}

        {/* Header */}
        <div className="text-center py-10 px-8" style={{ backgroundColor: creamColor }}>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: secondaryColor }}>
            {event.title}
          </h1>
          <div className="flex items-center justify-center gap-4 my-4">
            <div className="h-px flex-1" style={{ backgroundColor: primaryColor }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
            <div className="h-px flex-1" style={{ backgroundColor: primaryColor }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 py-10 bg-white">
          {/* Greeting */}
          <div className="text-center mb-8">
            <p className="text-xl md:text-2xl text-gray-800 mb-4 font-serif italic">
              Dear {guest.name},
            </p>
            {event.description && (
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-8 mb-8">
            <div className="text-center py-6 border-y-2" style={{ borderColor: creamColor }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: primaryColor, letterSpacing: '0.2em' }}>
                Date
              </p>
              <p className="text-2xl font-serif text-gray-800">{formattedDate}</p>
            </div>

            <div className="text-center py-6">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: primaryColor, letterSpacing: '0.2em' }}>
                Venue
              </p>
              <p className="text-xl font-serif text-gray-800">{event.venue}</p>
              {event.googleMapLink && (
                <a
                  href={event.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm mt-3 inline-block underline italic"
                  style={{ color: primaryColor }}
                >
                  View on Map
                </a>
              )}
            </div>
          </div>

          {/* Decorative Lace Pattern */}
          {assets.images?.['lace-pattern'] && (
            <div className="my-8 opacity-20">
              <div
                className="h-16 w-full"
                style={{
                  backgroundImage: `url(${assets.images['lace-pattern']})`,
                  backgroundRepeat: 'repeat-x',
                  backgroundSize: 'contain',
                }}
              />
            </div>
          )}

          {/* RSVP Button */}
          <div className="text-center mt-10">
            <a
              href={`/invite/${guest.inviteToken || ''}/rsvp`}
              className="inline-block px-10 py-3 text-white font-semibold rounded-sm transition-all hover:opacity-90 shadow-md uppercase tracking-wider"
              style={{
                backgroundColor: primaryColor,
                letterSpacing: '0.1em',
              }}
            >
              RSVP
            </a>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm italic text-gray-600 font-serif">
            <p>We look forward to your presence</p>
          </div>
        </div>

        {/* Lace Pattern Footer */}
        {assets.images?.['lace-pattern'] && (
          <div
            className="h-24 w-full opacity-30"
            style={{
              backgroundImage: `url(${assets.images['lace-pattern']})`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'contain',
            }}
          />
        )}
      </div>
    </div>
  );
}

