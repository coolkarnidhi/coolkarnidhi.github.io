/**
 * Case study page (project.html): reads ?id=<slug> from the URL, fetches
 * projects/<slug>.json, and renders it full-page using whichever of the
 * four templates that project's JSON declares. See README.md for the
 * per-template field shapes.
 */

function renderProject(p) {
  if (p.template === 1) {
    return `<div style="display:grid;grid-template-columns:1fr 160px;gap:1.5rem;align-items:start;margin-bottom:1rem;"><div><div class="popup-section-label">Context</div><div class="popup-text">${p.context}</div><div class="popup-section-label">Research Question</div><div class="popup-text">${p.question}</div></div><div><div class="popup-img" style="height:140px;margin-bottom:0.75rem;">${p.heroImg ? '<img src="'+p.heroImg+'" style="width:100%;height:100%;object-fit:cover;display:block;">' : 'Upload image'}</div>${p.badge ? '<span class="popup-badge">' + p.badge + '</span><br>' : ''}<span class="popup-author-badge">${p.authorRole}</span></div></div><div class="popup-divider"></div><div class="popup-2col" style="margin-bottom:1rem;"><div><div class="popup-section-label">Methodology</div><div class="popup-text">${p.methodology}</div></div><div><div class="popup-section-label">Findings</div><div class="popup-text">${p.findings}</div></div></div><div class="popup-img popup-img-hero" style="height:100px;margin-bottom:1rem;">${p.supportImg ? '<img src="'+p.supportImg+'" style="width:100%;height:100%;object-fit:cover;display:block;">' : 'Supporting image / diagram'}</div><div class="popup-section-label">My Contribution</div><div class="popup-text">${p.contribution}</div>`;
  }
  if (p.template === 2) {
    const statsHtml = p.stats.map(s => `<div><div class="popup-stat-label">${s.label}</div><div class="popup-stat-value${s.accent?' accent':''}">${s.value}</div></div>`).join('');
    const processHtml = p.process.map(s => `<div class="popup-process-step"><div class="popup-step-num">${s.num}</div><div class="popup-step-title">${s.title}</div><div class="popup-step-text">${s.text}</div></div>`).join('');
    const imgsHtml = p.images.map(src => `<div class="popup-img" style="height:100px;">${src ? '<img src="'+src+'" style="width:100%;height:100%;object-fit:cover;display:block;">' : 'Image'}</div>`).join('');
    return `<div class="popup-img popup-img-hero">${p.heroImg ? '<img src="'+p.heroImg+'" style="width:100%;height:100%;object-fit:cover;display:block;">' : 'Upload hero image'}</div><div style="display:grid;grid-template-columns:2fr 1fr;gap:1.5rem;margin-bottom:1rem;align-items:start;"><div class="popup-text">${p.about}</div><div style="display:flex;flex-direction:column;gap:0.75rem;">${statsHtml}</div></div><div class="popup-divider"></div><div class="popup-process">${processHtml}</div><div class="popup-2col">${imgsHtml}</div>`;
  }
  if (p.template === 3) {
    const imgsHtml = p.images.map(src => `<div class="popup-gallery-img">${src ? '<img src="'+src+'" style="width:100%;height:100%;object-fit:cover;display:block;">' : 'Image'}</div>`).join('');
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1rem;align-items:start;"><div class="popup-img" style="aspect-ratio:4/3;">${p.heroImg ? '<img src="'+p.heroImg+'" style="width:100%;height:100%;object-fit:cover;display:block;">' : 'Upload hero image'}</div><div><div class="popup-text">${p.about}</div><div class="popup-divider"></div><div class="popup-stat-label">Tools</div><div class="popup-stat-value" style="font-size:13px;font-weight:400;">${p.tools}</div></div></div><div class="popup-gallery">${imgsHtml}</div>`;
  }
  if (p.template === 4) {
    const imgsHtml = p.images.map(src => `<div class="popup-gallery-img">${src ? '<img src="'+src+'" style="width:100%;height:100%;object-fit:cover;display:block;">' : 'Image'}</div>`).join('');
    return `<div class="popup-img popup-img-hero">${p.heroImg ? '<img src="'+p.heroImg+'" style="width:100%;height:100%;object-fit:cover;display:block;">' : 'Upload hero image'}</div><div style="display:grid;grid-template-columns:2fr 1fr;gap:1.5rem;margin-bottom:1rem;align-items:start;"><div><div class="popup-section-label">About</div><div class="popup-text">${p.about}</div><div class="popup-divider"></div><div class="popup-section-label">My Role</div><div class="popup-text">${p.role}</div></div><div style="display:flex;flex-direction:column;gap:0.75rem;"><div><div class="popup-stat-label">Tools</div><div class="popup-stat-value" style="font-size:13px;font-weight:400;">${p.tools}</div></div><div><div class="popup-stat-label">Outcome</div><div class="popup-stat-value" style="font-size:13px;font-weight:400;">${p.outcome}</div></div></div></div><div class="popup-gallery">${imgsHtml}</div>`;
  }
  return '<p class="popup-text">Unknown project template.</p>';
}

function observeFadeUps() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

async function loadProject() {
  const id = new URLSearchParams(window.location.search).get('id');
  const tagEl = document.getElementById('project-tag');
  const titleEl = document.getElementById('project-title');
  const metaEl = document.getElementById('project-meta');
  const bodyEl = document.getElementById('project-body');

  if (!id) {
    bodyEl.innerHTML = '<p class="popup-text">No project specified.</p>';
    return;
  }

  let p;
  try {
    const res = await fetch(`projects/${id}.json`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    p = await res.json();
  } catch (err) {
    console.error(`Failed to load projects/${id}.json`, err);
    bodyEl.innerHTML = `<p class="popup-text">Sorry — this project couldn't be found.</p>`;
    return;
  }

  document.title = `${p.title} — Nidhi Kulkarni`;
  tagEl.textContent = p.tag;
  titleEl.textContent = p.title;
  metaEl.textContent = p.meta;
  bodyEl.innerHTML = renderProject(p);
  observeFadeUps();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProject);
} else {
  loadProject();
}
