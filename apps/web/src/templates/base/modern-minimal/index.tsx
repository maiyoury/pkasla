interface ModernMinimalTemplateProps {
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

export default function ModernMinimalTemplate({ event, guest, assets }: ModernMinimalTemplateProps) {
  const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const primaryColor = assets.colors?.primary || '#000000';
  const accentColor = assets.colors?.accent || '#8b7355';
  const frameBgImage = assets.images?.frame || assets.images?.background || event.coverImage;

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        backgroundImage: `url(${frameBgImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-linear-to-br from-black/20 via-transparent to-black/30" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 relative z-10">
        <div className="max-w-2xl w-full">
          {/* Glass card with subtle blur only */}
          <div 
            className="overflow-hidden">
            {/* Header with minimal background */}
            <div 
              className="relative px-6 sm:px-8 md:px-12 py-10 sm:py-12 md:py-16 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 rounded-full opacity-10" style={{ background: accentColor }} />
              
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight relative z-10 transition-all duration-500"
                style={{ 
                  color: primaryColor,
                  lineHeight: '1.1',
                }}
              >
                {event.title}
              </h1>
              
              {/* Decorative line */}
              <div 
                className="h-0.5 mt-6 sm:mt-8 rounded-full w-16 sm:w-20"
                style={{
                  background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                }}
              />
            </div>

            {/* Content */}
            <div className="px-6 sm:px-8 md:px-12 py-8 sm:py-10 md:py-12 space-y-8 sm:space-y-10">
              {/* Greeting */}
              <div>
                <p className="text-xl sm:text-2xl font-light mb-4 sm:mb-6" style={{ color: primaryColor }}>
                  Dear <span className="font-normal">{guest.name}</span>,
                </p>
                {event.description && (
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>

              {/* Event Details */}
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8">
                <div className="group">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-medium" style={{ color: accentColor }}>
                      Date & Time
                    </p>
                  </div>
                  <p className="text-lg sm:text-xl font-light mb-1" style={{ color: primaryColor }}>{formattedDate}</p>
                  <p className="text-base sm:text-lg font-light text-gray-600">{formattedTime}</p>
                </div>

                <div className="group">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-medium" style={{ color: accentColor }}>
                      Location
                    </p>
                  </div>
                  <p className="text-base sm:text-lg font-light mb-2" style={{ color: primaryColor }}>{event.venue}</p>
                  {event.googleMapLink && (
                    <a
                      href={event.googleMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
                      style={{ color: accentColor }}
                    >
                      Get Directions
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* RSVP Button */}
              <div className="pt-6 sm:pt-8">
                <a
                  href={`/invite/${guest.inviteToken || ''}/rsvp`}
                  className="group relative inline-block w-full text-center py-3 sm:py-4 rounded-xl font-light tracking-wide transition-all duration-300 overflow-hidden hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: primaryColor,
                    border: `2px solid ${primaryColor}`,
                  }}
                >
                  <span className="relative z-10 text-base sm:text-lg group-hover:text-white transition-colors duration-300">RSVP Now</span>
                  <div 
                    className="absolute inset-0 transition-transform duration-300 scale-0 group-hover:scale-100"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                      transformOrigin: 'center',
                    }}
                  />
                </a>
              </div>
            </div>

            {/* Footer */}
            <div 
              className="px-8 md:px-12 py-8 text-center border-t border-white/20"
            >
              <p className="text-sm text-gray-500 font-light tracking-wide">
                We look forward to celebrating with you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
