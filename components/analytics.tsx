import Script from 'next/script';

export function Analytics() {
  return (
    <>
      {/* Init dataLayer + stub gtag early so any click that fires before the
          heavy gtag.js arrives still gets queued instead of dropped. */}
      <Script id="analytics-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','G-R1S0Z20GHD');gtag('config','AW-17996002178');`}
      </Script>

      {/* Heavy gtag.js — fires events to GA4 (G-R1S0Z20GHD) and Google Ads
          (AW-17996002178). Lazy so it doesn't block LCP/TBT. */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17996002178"
        strategy="lazyOnload"
      />
    </>
  );
}
