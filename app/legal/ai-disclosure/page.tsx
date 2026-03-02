import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default function AiDisclosurePage() {
  return (
    <main>
      <Nav />
      <Container>
        <div className="prose-nuvvoo mx-auto max-w-3xl py-16">
          <h1 className="text-3xl font-semibold text-slate-900">AI Disclosure</h1>
          <p className="mt-3 text-slate-600">
            Nuvvoo uses AI to generate responses and help parse food logs. AI can be inaccurate. You are responsible for decisions you make.
          </p>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
