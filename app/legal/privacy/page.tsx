import { Container } from '@/components/container';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default function PrivacyPage() {
  return (
    <main>
      <Nav />
      <Container>
        <div className="prose-nuvvoo mx-auto max-w-3xl py-16">
          <h1 className="text-3xl font-semibold text-slate-900">Privacy Policy</h1>
          <p className="mt-3 text-slate-600">
            This is a placeholder privacy policy. Replace with your final text before launch.
          </p>
          <h2 className="mt-10 text-xl font-semibold text-slate-900">What we collect</h2>
          <p>
            Email address for early access notifications. In-app data (food logs, habits, and app usage) only if you choose to use the app.
          </p>
          <h2 className="mt-10 text-xl font-semibold text-slate-900">How we use it</h2>
          <p>
            To provide the service, improve product quality, and send launch and important product emails.
          </p>
          <h2 className="mt-10 text-xl font-semibold text-slate-900">Contact</h2>
          <p>privacy@yourdomain.com</p>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
