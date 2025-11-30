interface AnniversaryRomanceTemplateProps {
  event: {
    title: string;
    description?: string;
    date: string | Date;
    venue: string;
    googleMapLink?: string;
    coverImage?: string;
    years?: number | string;
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

export default function AnniversaryRomanceTemplate({ event, guest, assets }: AnniversaryRomanceTemplateProps) {
  const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const primaryColor = assets.colors?.primary || '#E91E63';
  const secondaryColor = assets.colors?.secondary || '#C2185B';
  const romanticPink = assets.colors?.['romantic-pink'] || '#F8BBD0';
  const romanticRed = assets.colors?.['romantic-red'] || '#E91E63';
  const backgroundImage = assets.images?.background || event.coverImage || '';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : `linear-gradient(135deg, ${romanticPink} 0%, ${primaryColor} 50%, ${romanticRed} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-2xl w-full bg-white/98 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Romantic Header with Hearts */}
        <div
          className="relative py-16 px-8 text-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${romanticRed} 100%)`,
          }}
        >
          {assets.images?.['hearts'] && (
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <img
                src={assets.images.hearts}
                alt=""
                className="w-32 h-32 animate-pulse"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white relative z-10 mb-3 drop-shadow-lg">
            {event.title}
          </h1>
          {event.years && (
            <p className="text-2xl md:text-3xl font-serif text-white relative z-10 italic">
              {event.years} {typeof event.years === 'number' && event.years === 1 ? 'Year' : 'Years'} of Love
            </p>
          )}
          {assets.images?.['roses'] && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-30">
              <img
                src={assets.images.roses}
                alt=""
                className="h-24 w-auto"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 py-10">
          {/* Greeting */}
          <div className="text-center mb-8">
            <p className="text-2xl md:text-3xl font-serif font-bold mb-3 italic" style={{ color: primaryColor }}>
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
            <div className="text-center py-6 rounded-xl" style={{ backgroundColor: `${romanticPink}20` }}>
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                Date
              </p>
              <p className="text-2xl font-serif text-gray-800">{formattedDate}</p>
            </div>

            <div className="text-center py-6 rounded-xl" style={{ backgroundColor: `${romanticPink}20` }}>
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
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

          {/* Decorative Hearts and Roses */}
          <div className="flex justify-center gap-6 my-8">
            {assets.images?.['hearts'] && (
              <img
                src={assets.images.hearts}
                alt=""
                className="h-16 w-auto opacity-40"
              />
            )}
            {assets.images?.['roses'] && (
              <img
                src={assets.images.roses}
                alt=""
                className="h-16 w-auto opacity-40"
              />
            )}
          </div>

          {/* RSVP Button */}
          <div className="text-center mt-10">
            <a
              href={`/invite/${guest.inviteToken || ''}/rsvp`}
              className="inline-block px-10 py-4 text-white font-semibold rounded-full transition-all hover:opacity-90 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${romanticRed} 100%)`,
              }}
            >
              RSVP
            </a>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm italic" style={{ color: primaryColor }}>
            <p>Join us in celebrating this special milestone ❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
}

