import './globals.css';

export const metadata = {
  title: 'StyleBook - Book Top Salons, Spas & Doorstep Grooming',
  description: 'Book verified haircut, styling, bridal, spa and grooming services in top salon branches or right at your doorstep. Verified ratings, real-time slots, and OTP check-in.',
  keywords: 'salon booking, doorstep barber, hair salon near me, spa booking, beauty parlour, grooming app',
  openGraph: {
    title: 'StyleBook - Book Top Salons, Spas & Doorstep Grooming',
    description: 'Instant appointments with verified hair stylists and top salon chains. In-salon and doorstep services with real-time OTP confirmation.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'StyleBook'
  }
};

export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for LocalBusiness SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'StyleBook Salon & Grooming Platform',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    description: 'On-demand salon booking and doorstep beauty services platform.',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN'
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
