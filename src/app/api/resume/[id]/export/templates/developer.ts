import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
  CustomContent,
  GitHubContent,
} from '@/types/resume';
import { esc, md, degreeField, getPersonalInfo, visibleSections, buildQrCodesHtml, type ResumeWithSections, type Section } from '../utils';

const CONTACT_COLOR = '#abb2bf';
const GITHUB_ICON_DATA_URL = `data:image/svg+xml;base64,${readFileSync(join(process.cwd(), 'public', 'icons', 'github.svg')).toString('base64')}`;
const EMAIL_ICON_HTML = `<svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor" aria-hidden="true" style="display:block;flex-shrink:0"><path d="M170.666667 128l682.666667 0q52.992 0 90.496 37.504t37.504 90.496l0 512q0 52.992-37.504 90.496t-90.496 37.504l-682.666667 0q-52.992 0-90.496-37.504t-37.504-90.496l0-512q0-52.992 37.504-90.496t90.496-37.504zM896 768l0-466.005333-357.333333 285.994667q-11.349333 9.344-26.666667 9.344t-26.666667-9.344l-357.333333-285.994667 0 466.005333q0 17.664 12.501333 30.165333t30.165333 12.501333l682.666667 0q17.664 0 30.165333-12.501333t12.501333-30.165333zM853.333333 213.333333l-682.666667 0q-6.314667 0-13.994667 2.346667l355.328 284.330667 355.328-284.330667q-7.68-2.346667-13.994667-2.346667z"></path></svg>`;

function getGitHubUrl(value: string): string {
  const trimmed = value.trim().replace(/^@/, '');
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^github\.com\//i.test(trimmed)) return `https://${trimmed}`;
  return `https://github.com/${trimmed}`;
}

function buildDeveloperSectionContent(section: Section, lang: string): string {
  const c = section.content;
  const DARK = '#282c34';
  const GREEN = '#98c379';
  const BLUE = '#61afef';
  const ORANGE = '#e5c07b';
  if (section.type === 'summary') return `<div class="text-sm leading-relaxed text-zinc-600">${md((c as SummaryContent).text)}</div>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(it.position)}</span>${it.company ? `<span class="text-sm" style="color:${BLUE}"> @ ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium" style="background:#f0f0f0;color:#636d83">${esc(it.startDate)} – ${esc(it.endDate) || (it.current ? (lang === 'zh' ? '至今' : 'Present') : '')}</span></div>
      ${it.description ? `<div class="mt-1 text-sm text-zinc-600">${md(it.description)}</div>` : ''}
      ${it.technologies?.length ? `<p class="mt-0.5 text-xs" style="color:${BLUE}">${lang === 'zh' ? '技术栈' : 'Tech'}: ${esc(it.technologies.join(' | '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="shrink-0 text-xs" style="color:${GREEN}">$</span><span style="min-width:0;flex:1;overflow-wrap:anywhere">${md(h)}</span></li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(degreeField(it.degree, it.field))}</span>${it.institution ? `<span class="text-sm text-zinc-500"> — ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate) || (lang === 'zh' ? '至今' : 'Present')}</span></div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="shrink-0 text-xs" style="color:${GREEN}">$</span><span style="min-width:0;flex:1;overflow-wrap:anywhere">${md(h)}</span></li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat) =>
      `<div><span class="text-xs font-bold" style="color:${ORANGE}">${esc(cat.name)}: </span><span class="text-sm text-zinc-600">${esc((cat.skills || []).join(' | '))}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-4">${((c as ProjectsContent).items || []).map((it) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(it.name)}</span></div>${it.startDate ? `<span class="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium" style="background:#f0f0f0;color:#636d83">${esc(it.startDate)} – ${it.endDate ? esc(it.endDate) : (lang === 'zh' ? '至今' : 'Present')}</span>` : ''}</div>
      ${it.description ? `<div class="mt-1 text-sm text-zinc-600">${md(it.description)}</div>` : ''}
      ${it.technologies?.length ? `<p class="mt-0.5 text-xs" style="color:${BLUE}">${lang === 'zh' ? '技术栈' : 'Tech'}: ${esc(it.technologies.join(' | '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="shrink-0 text-xs" style="color:${GREEN}">$</span><span style="min-width:0;flex:1;overflow-wrap:anywhere">${md(h)}</span></li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it) =>
      `<div class="flex items-baseline justify-between text-sm"><div><span class="font-semibold" style="color:${DARK}">${esc(it.name)}</span>${it.issuer ? `<span class="text-zinc-500"> — ${esc(it.issuer)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="space-y-1">${((c as LanguagesContent).items || []).map((it) =>
      `<div><span class="text-xs font-bold" style="color:${ORANGE}">${esc(it.language)}: </span><span class="text-sm text-zinc-600">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'github') {
    return `<div class="space-y-3">${((c as GitHubContent).items || []).map((it) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-bold" style="color:${DARK}">${esc(it.name)}</span><span class="shrink-0 text-xs text-zinc-400">\u2B50 ${it.stars?.toLocaleString() ?? 0}</span></div>
      ${it.language ? `<span class="text-xs" style="color:${BLUE}">${esc(it.language)}</span>` : ''}
      ${it.description ? `<div class="mt-1 text-sm text-zinc-600">${md(it.description)}</div>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(it.title)}</span>${it.subtitle ? `<span class="text-sm text-zinc-500"> — ${esc(it.subtitle)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.description ? `<div class="mt-1 text-sm text-zinc-600">${md(it.description)}</div>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'qr_codes') return buildQrCodesHtml(section);
  if ('items' in c && c.items) {
    const items = c.items as Array<{ id: string; name?: string; title?: string; language?: string; description?: string }>;
    return `<div class="space-y-2">${items.map((it) => `<div><span class="text-sm font-medium" style="color:${DARK}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<div class="text-sm text-zinc-600">${md(it.description)}</div>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildDeveloperHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.age, pi.politicalStatus, pi.gender, pi.ethnicity, pi.hometown, pi.maritalStatus, pi.yearsOfExperience, pi.educationLevel, pi.phone, pi.wechat, pi.location, pi.website].filter(Boolean);
  const DARK = '#282c34';
  const GREEN = '#98c379';
  const BLUE = '#61afef';
  const ORANGE = '#e5c07b';

  return `<div class="mx-auto max-w-[210mm] bg-white shadow-lg" style="font-family:'JetBrains Mono','Fira Code',monospace">
    <div class="px-8 py-6" style="background:${DARK}">
      <div class="mb-3 flex items-center gap-1.5">
        <div class="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
        <div class="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
        <div class="h-3 w-3 rounded-full bg-[#27c93f]"></div>
        <span class="ml-3 text-xs text-zinc-500">~/resume</span>
      </div>
      <div class="flex items-center gap-4">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-16 w-16 shrink-0 rounded-lg object-cover"/>` : ''}
        <div>
          <h1 class="text-2xl font-bold" style="color:${GREEN}">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-0.5 text-sm" style="color:${BLUE}">// ${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length || pi.email || pi.github ? `<div class="mt-2 flex flex-wrap items-center gap-3 text-xs" style="color:${CONTACT_COLOR}">
            ${contacts.slice(0, 8).map(c => `<span>${esc(c)}</span>`).join('')}
            ${pi.email ? `<a href="mailto:${esc(pi.email)}" style="color:${CONTACT_COLOR};text-decoration:none;display:inline-flex;align-items:center;gap:4px">${EMAIL_ICON_HTML}<span>${esc(pi.email)}</span></a>` : ''}
            ${contacts.slice(8).map(c => `<span>${esc(c)}</span>`).join('')}
            ${pi.github ? `<a href="${esc(getGitHubUrl(pi.github))}" target="_blank" rel="noopener noreferrer" style="color:${CONTACT_COLOR};text-decoration:none;display:inline-flex;align-items:center;gap:4px"><img src="${GITHUB_ICON_DATA_URL}" alt="" width="14" height="14" style="width:14px;height:14px;filter:brightness(0) invert(1);opacity:.7"/><span>${esc(pi.github)}</span></a>` : ''}
          </div>` : ''}
        </div>
      </div>
    </div>
    <div class="p-8">
      ${sections.map(s => `<div class="mb-6" data-section>
        <h2 class="mb-2 text-sm font-bold" style="color:${ORANGE}">&gt; ${esc(s.title).toUpperCase()}</h2>
        <div class="border-l-2 pl-4" style="border-color:#3e4451">
          ${buildDeveloperSectionContent(s, resume.language || 'en')}
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}
