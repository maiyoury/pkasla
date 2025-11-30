interface TropicalParadiseTemplateProps {
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

export default function TropicalParadiseTemplate({ event, guest, assets }: TropicalParadiseTemplateProps) {
  const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const primaryColor = assets.colors?.primary || '#00BCD4';
  const tropicalBlue = assets.colors?.['tropical-blue'] || '#00ACC1';
  const tropicalGreen = assets.colors?.['tropical-green'] || '#4CAF50';
  const backgroundImage = assets.images?.background || event.coverImage || '';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : `linear-gradient(135deg, ${tropicalBlue} 0%, ${tropicalGreen} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        {/* Tropical Header with Palm Leaves */}
        <div
          className="relative py-16 px-8 text-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${tropicalGreen} 100%)`,
          }}
        >
          {assets.images?.['palm-leaves'] && (
            <div className="absolute inset-0 opacity-20">
              <img
                src={assets.images['palm-leaves']}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white relative z-10 mb-3 drop-shadow-lg">
            {event.title}
          </h1>
          {assets.images?.['flowers'] && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-30">
              <img
                src={assets.images.flowers}
                alt=""
                className="h-20 w-auto"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 py-10">
          {/* Greeting */}
          <div className="text-center mb-8">
            <p className="text-2xl md:text-3xl font-bold mb-3" style={{ color: tropicalBlue }}>
              Aloha, {guest.name}!
            </p>
            {event.description && (
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-6 mb-8">
            <div className="text-center py-6 rounded-2xl" style={{ backgroundColor: `${tropicalBlue}15` }}>
              <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: tropicalBlue }}>
                Date
              </p>
              <p className="text-2xl font-bold text-gray-800">{formattedDate}</p>
            </div>

            <div className="text-center py-6 rounded-2xl" style={{ backgroundColor: `${tropicalGreen}15` }}>
              <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: tropicalGreen }}>
                Venue
              </p>
              <p className="text-xl font-bold text-gray-800">{event.venue}</p>
              {event.googleMapLink && (
                <a
                  href={event.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm mt-3 inline-block font-semibold underline"
                  style={{ color: tropicalBlue }}
                >
                  Get Directions
                </a>
              )}
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center gap-4 my-8">
            {assets.images?.['palm-leaves'] && (
              <img
                src={assets.images['palm-leaves']}
                alt=""
                className="h-16 w-auto opacity-40"
              />
            )}
            {assets.images?.['flowers'] && (
              <img
                src={assets.images.flowers}
                alt=""
                className="h-16 w-auto opacity-40"
              />
            )}
          </div>

          {/* RSVP Button */}
          <div className="text-center mt-10">
            <a
              href={`/invite/${guest.inviteToken || ''}/rsvp`}
              className="inline-block px-10 py-4 text-white font-bold rounded-full transition-all hover:opacity-90 shadow-lg uppercase tracking-wide"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${tropicalGreen} 100%)`,
              }}
            >
              RSVP
            </a>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm font-semibold" style={{ color: tropicalBlue }}>
            <p>We can&apos;t wait to celebrate with you! 🌺</p>
          </div>
        </div>
      </div>
    </div>
  );
}

