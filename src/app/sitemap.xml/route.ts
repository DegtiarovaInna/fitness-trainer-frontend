const locales = ["ru","uk","de"];
const paths = [
  "", "about", "services", "book", "blog",
  "legal/privacy","legal/terms","legal/cookies","legal/imprint",
  "legal/refunds","legal/accessibility","contacts",
];

export function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const urls = locales.flatMap(l =>
    paths.map(p => `${base}/${l}/${p}`.replace(/\/$/, ""))
  );
  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" }});
}
