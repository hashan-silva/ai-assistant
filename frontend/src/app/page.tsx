type HighlightCardProps = {
  title: string;
  description: string;
};

const highlights: HighlightCardProps[] = [
  {
    title: 'Hire top talent',
    description: 'Browse vetted freelancers, review portfolios, and hire with confidence.'
  },
  {
    title: 'Post work in minutes',
    description: 'Create detailed job briefs with milestones, budgets, and delivery expectations.'
  },
  {
    title: 'Secure payments',
    description: 'Escrow-based billing keeps clients and talent protected through every milestone.'
  }
];

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
          Helpclub Marketplace
        </p>
        <h1 className="text-4xl font-bold text-slate-900">Build like Upwork or Freelancer</h1>
        <p className="mx-auto max-w-2xl text-base text-slate-600">
          This Next.js frontend pairs with the Spring Boot + Oracle backend to deliver a modern
          freelancer marketplace experience.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
