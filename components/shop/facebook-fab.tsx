import { Facebook } from 'lucide-react';

export function FacebookFAB() {
  const facebookPageUrl = "https://www.facebook.com/share/1ANTiMr88r/?mibextid=wwXIfr";

  return (
    <a
      href={facebookPageUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
      aria-label="Liên hệ qua Facebook"
    >
      <Facebook className="h-5 w-5 md:h-7 md:w-7" fill="currentColor" />
    </a>
  );
}
