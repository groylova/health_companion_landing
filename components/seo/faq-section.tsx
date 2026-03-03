'use client';
import { useState } from 'react';

type FAQ = {
  question: string;
  answer: string | React.ReactNode;
};

export function FaqSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-8 space-y-4">
        {faqs.map((faq, index) => (
          <FaqItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: typeof faq.answer === 'string' ? faq.answer : '',
              },
            })),
          }),
        }}
      />
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-slate-900">{question}</h3>
        <span className="ml-4 text-2xl text-nuvvooGreen-600">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="prose-nuvvoo mt-4">
          {typeof answer === 'string' ? <p>{answer}</p> : answer}
        </div>
      )}
    </div>
  );
}
