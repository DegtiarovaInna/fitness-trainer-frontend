export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand/10 p-4">
      {}
      <h1 className="text-4xl font-bold text-brand mb-4">
        Hello, Tailwind & Next.js!
      </h1>
      {}
      <p className="prose prose-lg text-gray-800">
        Это проверка плагина <code>@tailwindcss/typography</code> и цвета <code>brand</code>.
      </p>
    </main>
  );
}