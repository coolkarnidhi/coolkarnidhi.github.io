/**
 * Shared factual content for nidhikulkarni.com — index.html, site-professional.html,
 * site-practice.html all load this file and sync from it. Edit values here once;
 * every page updates. Interpretive/framing prose (About paragraphs, headlines, project
 * descriptions) stays hand-written per page and is NOT synced from here — only
 * audience-neutral facts (dates, credentials, links) live in this file.
 */
const NK_FACTS = {
  name: "Nidhi Kulkarni",
  basedIn: "Bangalore, India",
  years: 8,
  yearsWord: "eight years",
  yearsWordCap: "Eight years",
  degreeSentence: "Bachelor of Design from Srishti Manipal Institute of Art, Design and Technology",
  institutionShort: "Srishti Manipal Institute of Art, Design and Technology, B.Des",
  publicationsMention: "published research at ACM COMPASS and FAccT",
  employers: ["Karya", "Microsoft Research"],
  publications: [
    {
      title: "Speaking in Terms of Money: Knowledge Acquisition via Speech Data Generation",
      venue: "ACM SIGCAS/SIGCHI Conference on Computing and Sustainable Societies (COMPASS '24) — ACM Journal on Computing and Sustainable Societies, Vol. 2, Issue 3",
      role: "First Author",
      roleAccent: true,
      badge: "Published"
    },
    {
      title: "Akal Badi ya Bias: An Exploratory Study of Gender Bias in Hindi",
      venue: "ACM Conference on Fairness, Accountability, and Transparency (FAccT '24)",
      role: "Contributing Author",
      roleAccent: false,
      badge: "Best Paper"
    }
  ],
  email: "nidhikulkarni0110@gmail.com",
  linkedin: "https://linkedin.com/in/coolkarnidhi",
  scholar: "https://scholar.google.com",
  resumeUrl: "#",
  copyrightYear: 2026
};

/**
 * Syncs any element carrying a data-fact / data-fact-list / data-pub attribute
 * to the current values in NK_FACTS. Every synced element already has correct,
 * hand-written fallback content in the HTML — if this script fails to load or
 * JS is disabled, the page still reads correctly, just without the sync guarantee.
 */
function syncFacts() {
  document.querySelectorAll('[data-fact]').forEach(el => {
    const key = el.getAttribute('data-fact');
    const value = {
      'based-in': NK_FACTS.basedIn,
      'years-word': NK_FACTS.yearsWord,
      'years-word-cap': NK_FACTS.yearsWordCap,
      'degree-sentence': NK_FACTS.degreeSentence,
      'institution-short': NK_FACTS.institutionShort,
      'publications-mention': NK_FACTS.publicationsMention,
      'copyright-year': NK_FACTS.copyrightYear,
    }[key];
    if (value === undefined) return;
    if (el.hasAttribute('href')) {
      if (key === 'email-link') el.href = 'mailto:' + NK_FACTS.email;
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll('[data-fact-href]').forEach(el => {
    const key = el.getAttribute('data-fact-href');
    const href = {
      'email': 'mailto:' + NK_FACTS.email,
      'linkedin': NK_FACTS.linkedin,
      'scholar': NK_FACTS.scholar,
      'resume': NK_FACTS.resumeUrl,
    }[key];
    if (href !== undefined) el.href = href;
  });

  const employersEl = document.querySelector('[data-fact-list="employers"]');
  if (employersEl) {
    employersEl.innerHTML = NK_FACTS.employers
      .map(name => `<span class="detail-value">${name}</span>`)
      .join('');
  }

  document.querySelectorAll('[data-pub]').forEach(el => {
    const pub = NK_FACTS.publications[Number(el.getAttribute('data-pub'))];
    if (!pub) return;
    const titleEl = el.querySelector('.research-title');
    const venueEl = el.querySelector('.research-venue');
    const roleEl = el.querySelector('.research-role');
    const badgeEl = el.querySelector('.research-badge');
    if (titleEl) titleEl.textContent = pub.title;
    if (venueEl) venueEl.textContent = pub.venue;
    if (roleEl) {
      roleEl.textContent = pub.role;
      roleEl.classList.toggle('accent', !!pub.roleAccent);
    }
    if (badgeEl) badgeEl.textContent = pub.badge;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncFacts);
} else {
  syncFacts();
}
