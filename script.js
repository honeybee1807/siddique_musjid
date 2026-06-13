/* -----------------------------------------------------------------
   Siddique Charitable Foundation NPC — Interactions
   Olideen Technologies · olideentech.co.za
   Newcastle, KwaZulu-Natal · 2026

   Developer: Lubnah Olideen
   Stack: Vanilla JS · GSAP 3.12 · ScrollTrigger · Supabase REST API
   ----------------------------------------------------------------- */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // — nav
  const scfNav          = document.querySelector('.scf-nav');
  const navToggle       = document.querySelector('.scf-nav__toggle');
  const navOverlay      = document.querySelector('.scf-nav__overlay');
  const navOverlayClose = document.querySelector('.scf-nav__overlay-close');

  // — donation tiers
  const tierBtns     = document.querySelectorAll('.tier-btn');
  const customInputs = document.querySelectorAll('.custom-amount-input');

  // — copy buttons
  const copyBtns = document.querySelectorAll('.copy-account');

  // — progress
  const progressFill  = document.querySelector('.progress-fill');
  const progressBadge = document.querySelector('.progress-badge');
  const progressRail  = document.querySelector('.progress-rail');

  // — counters
  const raisedCounter    = document.querySelector('.counter--raised');
  const remainingCounter = document.querySelector('.counter--remaining');

  // — madressa CTA
  const madressaCta = document.querySelector('.madressa-contribute-btn');

  /* ----------- mobile nav overlay ----------- */
  function setOverlay(open) {
    navOverlay.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navOverlay.classList.contains('is-open');
    setOverlay(!isOpen);
  });

  if (navOverlayClose) {
    navOverlayClose.addEventListener('click', () => setOverlay(false));
  }

  navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOverlay(false));
  });

  /* ----------- smooth scroll with nav offset ----------- */
  // intercept all anchor clicks so the fixed nav never covers the target
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      setOverlay(false);
      const navHeight = scfNav.getBoundingClientRect().height;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ----------- nav scroll background ----------- */
  // flip the nav background once hero scrolls past
  function handleNavScroll() {
    if (window.scrollY > 80) {
      scfNav.classList.add('scf-nav--scrolled');
    } else {
      scfNav.classList.remove('scf-nav--scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ----------- donation tier select ----------- */
  function handleTierSelect(e) {
    const btn  = e.currentTarget;
    const card = btn.closest('.contrib-card');
    card.querySelectorAll('.tier-btn').forEach(b =>
      b.classList.remove('tier-btn--selected')
    );
    btn.classList.add('tier-btn--selected');
    const customInput = card.querySelector('.custom-amount-input');
    if (customInput) customInput.value = '';
  }

  tierBtns.forEach(btn => btn.addEventListener('click', handleTierSelect));

  // deselect presets when custom input is used
  customInputs.forEach(input => {
    input.addEventListener('input', () => {
      const card = input.closest('.contrib-card');
      card.querySelectorAll('.tier-btn').forEach(b =>
        b.classList.remove('tier-btn--selected')
      );
    });
  });

  /* ----------- copy account number ----------- */
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const number = btn.dataset.account;
      try {
        await navigator.clipboard.writeText(number);
        const original = btn.innerHTML;
        btn.innerHTML = '✓ Copied';
        btn.style.color = 'var(--clr-mint)';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.color = '';
        }, 2000);
      } catch {
        // fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = number;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    });
  });

  /* ----------- contrib CTA flash ----------- */
  document.querySelectorAll('.contrib-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSel = btn.dataset.flashTarget;
      if (!targetSel) return;
      const target = document.querySelector(targetSel);
      if (!target) return;
      target.style.transition = 'box-shadow 0.3s ease';
      target.style.boxShadow  = '0 0 0 3px var(--clr-mint)';
      setTimeout(() => { target.style.boxShadow = ''; }, 1500);
    });
  });

  /* ----------- madressa video — play on click ----------- */
  const madressaThumb  = document.getElementById('madressa-video-thumb');
  const madressaIframe = document.getElementById('madressa-video-iframe');

  function playMadressaVideo() {
    if (!madressaIframe || !madressaThumb) return;
    madressaIframe.src = madressaIframe.dataset.src;
    madressaThumb.classList.add('is-hidden');
  }

  if (madressaThumb) {
    madressaThumb.addEventListener('click', playMadressaVideo);
    madressaThumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playMadressaVideo();
      }
    });
  }

  /* ----------- highlight zakaat card ----------- */
  function highlightZakaatCard() {
    const zakaatCard = document.querySelector('.contrib-card--zakaat');
    if (!zakaatCard) return;
    zakaatCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    zakaatCard.style.transition = 'box-shadow 0.3s ease';
    zakaatCard.style.boxShadow  = '0 0 0 3px var(--clr-mint)';
    setTimeout(() => { zakaatCard.style.boxShadow = ''; }, 1500);
  }

  if (madressaCta) {
    madressaCta.addEventListener('click', (e) => {
      e.preventDefault();
      highlightZakaatCard();
    });
  }

  /* ----------- supabase config ----------- */
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // swap in real values when Supabase org is set up
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
  const SUPABASE_KEY = 'YOUR-ANON-PUBLIC-KEY';

  async function fetchDonationProgress() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/donation_progress?id=eq.1&select=raised_amount,goal_amount`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      );
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      return data[0] ?? { raised_amount: 128000, goal_amount: 5000000 };
    } catch {
      // silent fallback — show placeholder values if supabase unreachable
      return { raised_amount: 128000, goal_amount: 5000000 };
    }
  }

  /* ----------- gsap scroll triggers ----------- */
  function initScrollTriggers() {
    gsap.registerPlugin(ScrollTrigger);

    // hero — reveal elements then animate in
    document.querySelectorAll('.js-hidden').forEach(el => el.classList.remove('js-hidden'));
    gsap.fromTo('.hero-animate',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out', delay: 0.15 }
    );

    // section fade-ins on scroll
    gsap.utils.toArray('.fade-on-scroll').forEach(el => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // hero stat elements
    const heroStatRaised = document.getElementById('hero-stat-raised');
    const heroStatGoal   = document.getElementById('hero-stat-goal');

    // fetch supabase data — feeds both hero stats and tracker section
    fetchDonationProgress().then(({ raised_amount, goal_amount }) => {
      const targetRaised    = raised_amount;
      const targetGoal      = goal_amount;
      const targetRemaining = targetGoal - targetRaised;
      const targetPct       = Math.min((targetRaised / targetGoal) * 100, 100);

      // ── hero stat counters — fire on load after hero animates in ──
      if (heroStatRaised) {
        const heroProxy = { val: 0 };
        gsap.to(heroProxy, {
          val: targetRaised,
          duration: 1.6,
          ease: 'power2.out',
          delay: 1.4,
          onUpdate: function () {
            heroStatRaised.textContent = 'R ' +
              Math.round(heroProxy.val).toLocaleString('en-ZA');
          }
        });
      }
      if (heroStatGoal) {
        heroStatGoal.textContent = 'R ' + targetGoal.toLocaleString('en-ZA');
      }

      // ── tracker section — fires on scroll ──
      if (progressFill && progressRail) {
        ScrollTrigger.create({
          trigger: progressRail,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            // animate fill width
            gsap.to(progressFill, {
              width: targetPct + '%',
              duration: 1.8,
              ease: 'power2.inOut',
              onUpdate: function () {
                const railW    = progressRail.getBoundingClientRect().width;
                const fillW    = progressFill.getBoundingClientRect().width;
                const pct      = Math.max(0, Math.round(fillW / railW * 100));
                if (progressBadge) {
                  progressBadge.textContent = pct + '%';
                  const railLeft  = progressRail.getBoundingClientRect().left;
                  const fillRight = progressFill.getBoundingClientRect().right;
                  progressBadge.style.left = (fillRight - railLeft) + 'px';
                }
                progressRail.setAttribute('aria-valuenow', pct);
              }
            });

            // raised counter
            if (raisedCounter) {
              const proxy = { val: 0 };
              gsap.to(proxy, {
                val: targetRaised,
                duration: 1.8,
                ease: 'power2.inOut',
                onUpdate: function () {
                  raisedCounter.textContent = 'R ' +
                    Math.round(proxy.val).toLocaleString('en-ZA');
                }
              });
            }

            // remaining counter — counts DOWN from goal
            if (remainingCounter) {
              const remainingProxy = { val: targetGoal };
              gsap.to(remainingProxy, {
                val: targetRemaining,
                duration: 1.8,
                ease: 'power2.inOut',
                onUpdate: function () {
                  remainingCounter.textContent = 'R ' +
                    Math.round(remainingProxy.val).toLocaleString('en-ZA');
                }
              });
            }
          }
        });

        // keep badge aligned on resize
        window.addEventListener('resize', () => {
          if (progressBadge) {
            const railLeft  = progressRail.getBoundingClientRect().left;
            const fillRight = progressFill.getBoundingClientRect().right;
            progressBadge.style.left = (fillRight - railLeft) + 'px';
          }
        }, { passive: true });
      }
    });

    // timeline stagger
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.from(item, {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        delay: (i % 6) * 0.06
      });
    });
  }

  /* ----------- bootstrap ----------- */
  // wait for GSAP to be available before initialising scroll triggers
  if (typeof gsap !== 'undefined') {
    initScrollTriggers();
  } else {
    // gsap didn't load — reveal hero immediately so nothing stays invisible
    document.querySelectorAll('.js-hidden').forEach(el => el.classList.remove('js-hidden'));
  }

}); // end DOMContentLoaded