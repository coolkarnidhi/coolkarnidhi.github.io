/**
 * Work list behavior for index.html: loads projects/manifest.json, renders
 * the Work list as real links to project.html?id=<slug>, and wires up
 * filtering + fade-up scroll reveals. Case study content itself lives in
 * project.html / project.js — see README.md.
 *
 * To add a project: add one entry to projects/manifest.json (for the Work
 * list row) and one projects/<id>.json file (for the case study page),
 * shaped like whichever of the four templates fits — see README.md. No
 * HTML/CSS/JS edits needed for ordinary content additions.
 */

let manifest = [];

async function loadWork() {
  const container = document.getElementById('work-list');
  try {
    const res = await fetch('projects/manifest.json');
    manifest = await res.json();
  } catch (err) {
    console.error('Failed to load projects/manifest.json', err);
    return;
  }

  container.innerHTML = manifest.map(renderListRow).join('');
  setupFilterCounts();
  observeFadeUps();
}

function renderListRow(item) {
  const tagsHtml = item.tags.map(t =>
    `<span class="list-tag${t.secondary ? ' secondary' : ''}">${t.label}</span>`
  ).join('');
  const subtitleHtml = item.subtitle ? `<span class="list-subtitle">${item.subtitle}</span>` : '';
  return `<a class="list-row" href="project.html?id=${encodeURIComponent(item.id)}" data-type="${item.type}"><span class="list-year${item.yearAccent ? ' accent' : ''}">${item.year}</span><span class="list-title">${item.title}${subtitleHtml}</span><span class="list-employer">${item.employer}</span><div class="list-tags">${tagsHtml}</div><span class="list-arrow"><span class="hover-dot"></span>↗</span></a>`;
}

function filterWork(type, btn) {
  document.querySelectorAll('.filter-link').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.list-row').forEach(row => {
    const types = row.dataset.type ? row.dataset.type.split(' ') : [];
    row.classList.toggle('hidden-row', !(type === 'all' || types.includes(type)));
  });
}

function setupFilterCounts() {
  const workRows = document.querySelectorAll('.list-row');
  const totalWorks = workRows.length;
  document.querySelectorAll('.filter-link').forEach(btn => {
    const type = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
    const n = type === 'all' ? totalWorks : Array.from(workRows).filter(r => (r.dataset.type || '').split(' ').includes(type)).length;
    const badge = btn.querySelector('.filter-count');
    if (badge) badge.textContent = n;
  });
  const counter = document.getElementById('work-counter');
  if (counter) counter.textContent = totalWorks + ' projects';
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadWork);
} else {
  loadWork();
}
