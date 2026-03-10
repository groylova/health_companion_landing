import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nuvvoo Your AI Health Companion',
    template: '%s · Nuvvoo',
  },
  description:
    'A gentle AI companion that helps you stay on track with food, habits, and energy without pressure.',
  openGraph: {
    title: 'Nuvvoo Track by chatting, not logging',
    description:
      'A gentle AI companion that helps you stay on track with food, habits, and energy without pressure.',
    type: 'website',
    url: siteUrl,
    images: [
      {
        url: '/images/og.png',
        width: 1200,
        height: 630,
        alt: 'Nuvvoo Track by chatting, not logging',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuvvoo Track food by chatting, not logging',
    description:
      'A gentle AI companion that helps you stay on track with food, habits, and energy without pressure. You need only one button.',
    images: ['/images/og.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17996002178"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-R1S0Z20GHD');
gtag('config', 'AW-17996002178');`}
        </Script>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KMGPK4KM');`}
        </Script>
        <Script id="scroll-depth-tracking" strategy="afterInteractive">
          {`(function(){
var thresholds=[25,50,75,90],fired={};
function getScrollPercent(){
  var h=document.documentElement,b=document.body;
  var st=h.scrollTop||b.scrollTop;
  var sh=(h.scrollHeight||b.scrollHeight)-h.clientHeight;
  return sh>0?Math.round((st/sh)*100):0;
}
function send(name,params){
  if(typeof gtag==='function'){gtag('event',name,params);}
  else{(window.dataLayer=window.dataLayer||[]).push(Object.assign({event:name},params));}
}
function check(){
  var p=getScrollPercent();
  for(var i=0;i<thresholds.length;i++){
    var t=thresholds[i];
    if(p>=t&&!fired[t]){
      fired[t]=true;
      send('scroll_depth',{percent_scrolled:t,page_path:location.pathname});
    }
  }
}
var ticking=false;
window.addEventListener('scroll',function(){
  if(!ticking){ticking=true;requestAnimationFrame(function(){check();ticking=false;});}
});
})();`}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KMGPK4KM"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
