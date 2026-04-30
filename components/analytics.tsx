import Script from 'next/script';

export function Analytics() {
  return (
    <>
      {/* Init dataLayer + stub gtag early so any click that fires before the
          heavy gtag.js arrives still gets queued instead of dropped. */}
      <Script id="analytics-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','G-R1S0Z20GHD');gtag('config','AW-17996002178');`}
      </Script>

      {/* gtag.js — fires events to GA4 (G-R1S0Z20GHD) and Google Ads
          (AW-17996002178). afterInteractive (not lazyOnload) so user_engagement
          heartbeats and Enhanced Measurement listeners attach in time —
          lazyOnload caused average engagement time to read as ~0s. */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17996002178"
        strategy="afterInteractive"
      />

      {/* Custom scroll-depth events at 25/50/75/90%. GA4 Enhanced Measurement
          only fires `scroll` once at 90%, so we keep the homegrown thresholds
          for parity with the pre-GTM-strip reports. */}
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
    </>
  );
}
