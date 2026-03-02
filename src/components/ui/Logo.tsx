export function CryptexLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cryptex logo"
    >
      {/* Diamond shape */}
      <path d="M20 2L38 20L20 38L2 20L20 2Z" fill="url(#logo-grad)" />
      {/* Diamond outline inset */}
      <path d="M20 5L35 20L20 35L5 20L20 5Z" stroke="white" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
      {/* Letter C */}
      <text
        x="20"
        y="20"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="16"
        letterSpacing="-0.5"
      >
        C
      </text>
      <defs>
        <linearGradient id="logo-grad" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1b6ef5" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CryptexLogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <CryptexLogo className="h-9 w-9" />
      <span className="font-heading text-xl font-bold tracking-tight text-gray-900">
        Cryptex
      </span>
    </div>
  );
}
