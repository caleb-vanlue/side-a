export const TECH_COLORS = {
  // Frontend Frameworks & Libraries
  "Next.js": "bg-blue-100 text-blue-700",
  "Vue.js": "bg-green-100 text-green-700",
  React: "bg-cyan-100 text-cyan-700",
  SwiftUI: "bg-orange-100 text-orange-700",
  "Jetpack Compose": "bg-lime-100 text-lime-700",

  // Styling
  "Tailwind CSS": "bg-teal-100 text-teal-700",

  // Backend Frameworks
  NestJS: "bg-red-100 text-red-700",
  "ASP.NET": "bg-purple-100 text-purple-700",

  // Languages
  TypeScript: "bg-indigo-100 text-indigo-700",
  "C#": "bg-violet-100 text-violet-700",

  // Databases
  PostgreSQL: "bg-sky-100 text-sky-700",

  // APIs & Services
  GraphQL: "bg-pink-100 text-pink-700",
  OpenAPI: "bg-amber-100 text-amber-700",
  "Spotify Web API": "bg-emerald-100 text-emerald-700",

  // Infrastructure & Deployment
  Railway: "bg-slate-100 text-slate-700",
  Vercel: "bg-zinc-100 text-zinc-700",
  "Google Cloud": "bg-yellow-100 text-yellow-700",
  Docker: "bg-blue-100 text-blue-700",

  // CMS & Tools
  WordPress: "bg-blue-100 text-blue-700",
  "Apache Kafka": "bg-orange-100 text-orange-700",
  TypeORM: "bg-green-100 text-green-700",
  "Plex Media Server": "bg-purple-100 text-purple-700",
} as const;

export const TECH_URLS = {
  // Frontend Frameworks & Libraries
  "Next.js": "https://nextjs.org",
  "Vue.js": "https://vuejs.org",
  React: "https://reactjs.org",
  SwiftUI: "https://developer.apple.com/xcode/swiftui/",
  "Jetpack Compose": "https://developer.android.com/jetpack/compose",

  // Styling
  "Tailwind CSS": "https://tailwindcss.com",

  // Backend Frameworks
  NestJS: "https://nestjs.com",
  "ASP.NET": "https://dotnet.microsoft.com/apps/aspnet",

  // Languages
  TypeScript: "https://www.typescriptlang.org",
  "C#": "https://docs.microsoft.com/en-us/dotnet/csharp/",

  // Databases
  PostgreSQL: "https://www.postgresql.org",

  // APIs & Services
  GraphQL: "https://graphql.org",
  OpenAPI: "https://www.openapis.org",
  "Spotify Web API": "https://developer.spotify.com/documentation/web-api/",

  // Infrastructure & Deployment
  Railway: "https://railway.app",
  Vercel: "https://vercel.com",
  "Google Cloud": "https://cloud.google.com",
  Docker: "https://www.docker.com",

  // CMS & Tools
  WordPress: "https://wordpress.org",
  "Apache Kafka": "https://kafka.apache.org",
  TypeORM: "https://typeorm.io",
  "Plex Media Server": "https://www.plex.tv",
} as const;

const FALLBACK_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-emerald-100 text-emerald-700",
  "bg-teal-100 text-teal-700",
  "bg-cyan-100 text-cyan-700",
  "bg-sky-100 text-sky-700",
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
];

export function getTechColor(technology: string): string {
  if (technology in TECH_COLORS) {
    return TECH_COLORS[technology as keyof typeof TECH_COLORS];
  }

  const hash = technology.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const colorIndex = Math.abs(hash) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[colorIndex];
}

export function getTechUrl(technology: string): string | undefined {
  return TECH_URLS[technology as keyof typeof TECH_URLS];
}
