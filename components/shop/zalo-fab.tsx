export function ZaloFAB() {
  const zaloUrl = "https://zalo.me/0835978834";

  return (
    <a
      href={zaloUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-16 right-4 md:bottom-24 md:right-6 z-50 flex flex-col gap-0.5 md:gap-1 items-center justify-center px-2 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-500 text-white shadow-lg transition-all duration-300 hover:bg-blue-600 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
      aria-label="Liên hệ qua Zalo"
    >
      <svg
        className="h-4 w-4 md:h-6 md:w-6"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 4C12.96 4 4 12.96 4 24C4 29.52 6.48 34.44 10.32 37.92L8.88 43.2L14.4 41.76C17.52 43.2 20.64 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4Z"
          fill="currentColor"
        />
        <path
          d="M15.6 28.8L19.2 25.2L22.8 28.8L28.8 22.8L32.4 19.2L28.8 22.8L25.2 19.2L19.2 25.2L15.6 28.8Z"
          fill="white"
        />
        <path
          d="M24 14.4C19.2 14.4 15.6 18 15.6 22.8C15.6 24.96 16.56 26.88 18 28.32L16.8 31.2L19.92 30L21.12 30.48C22.08 30.72 23.04 30.96 24 30.96C28.8 30.96 32.4 27.36 32.4 22.8C32.4 18 28.8 14.4 24 14.4Z"
          fill="white"
        />
      </svg>
      <span className="text-[10px] md:text-xs font-semibold">Zalo</span>
    </a>
  );
}
