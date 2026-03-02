import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default function TermsPage() {
  return (
    <main>
      <Nav />
      <Container>
        <div className="prose-nuvvoo mx-auto max-w-3xl py-16">
          <h1 className="text-3xl font-semibold text-slate-900">Terms of Service</h1>
          <p className="mt-3 text-slate-600">
            Placeholder terms. Replace with your final text before launch.
          </p>
          <h2 className="mt-10 text-xl font-semibold text-slate-900">Medical disclaimer</h2>
          <p>
            Nuvvoo is not medical advice. Always consult a qualified professional for medical guidance.
          </p>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
