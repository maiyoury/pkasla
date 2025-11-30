interface BirthdayCelebrationTemplateProps {
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
    age?: number | string;
    inviteToken?: string;
    meta?: Record<string, string>;
  };
  assets: {
    images?: Record<string, string>;
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
  };
}

export default function BirthdayCelebrationTemplate({ event, guest, assets }: BirthdayCelebrationTemplateProps) {
  const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const primaryColor = assets.colors?.primary || '#FF6B6B';
  const secondaryColor = assets.colors?.secondary || '#4ECDC4';
  const accentColor = assets.colors?.accent || '#FFE66D';
  const celebrationColor = assets.colors?.celebration || '#FF8B94';
  const backgroundImage = assets.images?.background || event.coverImage || '';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        {/* Fun Header with Balloons */}
        <div
          className="relative py-16 px-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${celebrationColor} 100%)`,
          }}
        >
          {assets.images?.['balloons'] && (
            <div className="absolute top-0 left-0 right-0 flex justify-around opacity-60">
              <img
                src={assets.images.balloons}
                alt=""
                className="h-20 w-auto transform rotate-12"
              />
              <img
                src={assets.images.balloons}
                alt=""
                className="h-24 w-auto transform -rotate-12"
              />
              <img
                src={assets.images.balloons}
                alt=""
                className="h-20 w-auto transform rotate-12"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white relative z-10 mb-2 drop-shadow-lg">
            {event.title}
          </h1>
          {guest.age && (
            <p className="text-2xl md:text-3xl font-bold text-white relative z-10">
              {guest.age} {typeof guest.age === 'number' && guest.age === 1 ? 'Year' : 'Years'} Old!
            </p>
          )}
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 py-10">
          {/* Greeting */}
          <div className="text-center mb-8">
            <p className="text-2xl md:text-3xl font-bold mb-3" style={{ color: primaryColor }}>
              Hey {guest.name}! 🎉
            </p>
            {event.description && (
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-6 mb-8">
            <div className="text-center py-6 rounded-2xl" style={{ backgroundColor: `${primaryColor}15` }}>
              <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                Party Date
              </p>
              <p className="text-2xl font-bold text-gray-800">{formattedDate}</p>
            </div>

            <div className="text-center py-6 rounded-2xl" style={{ backgroundColor: `${secondaryColor}15` }}>
              <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: secondaryColor }}>
                Where
              </p>
              <p className="text-xl font-bold text-gray-800">{event.venue}</p>
              {event.googleMapLink && (
                <a
                  href={event.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm mt-3 inline-block font-semibold underline"
                  style={{ color: primaryColor }}
                >
                  Get Directions
                </a>
              )}
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center gap-4 my-8">
            {assets.images?.['confetti'] && (
              <img
                src={assets.images.confetti}
                alt=""
                className="h-16 w-auto opacity-60"
              />
            )}
            {assets.images?.['balloons'] && (
              <img
                src={assets.images.balloons}
                alt=""
                className="h-16 w-auto opacity-60"
              />
            )}
          </div>

          {/* RSVP Button */}
          <div className="text-center mt-10">
            <a
              href={`/invite/${guest.inviteToken || ''}/rsvp`}
              className="inline-block px-10 py-4 text-white font-bold rounded-full transition-all hover:opacity-90 shadow-lg uppercase tracking-wide"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${celebrationColor} 100%)`,
              }}
            >
              RSVP
            </a>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm font-bold" style={{ color: primaryColor }}>
            <p>Let&apos;s celebrate together! 🎂🎈</p>
          </div>
        </div>
      </div>
    </div>
  );
}

