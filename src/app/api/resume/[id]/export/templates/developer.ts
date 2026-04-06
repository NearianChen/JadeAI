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
import { esc, md, degreeField, getPersonalInfo, visibleSections, buildHighlights, buildQrCodesHtml, type ResumeWithSections, type Section } from '../utils';

function buildDeveloperSectionContent(section: Section, lang: string): string {
  const c = section.content as any;
  const DARK = '#282c34';
  const GREEN = '#98c379';
  const BLUE = '#61afef';
  const ORANGE = '#e5c07b';



  if (section.type === 'summary') return `<div class="text-sm leading-relaxed text-zinc-600">${md((c as SummaryContent).text)}</div>`;

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(it.position)}</span>${it.company ? `<span class="text-sm" style="color:${BLUE}"> @ ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate) || (it.current ? (lang === 'zh' ? '至今' : 'Present') : '')}</span></div>
      ${it.description ? `<div class="mt-1 text-sm text-zinc-600">${md(it.description)}</div>` : ''}
      ${it.technologies?.length ? `<p class="mt-0.5 text-xs" style="color:${BLUE}">${lang === 'zh' ? '技术栈' : 'Tech'}: ${esc(it.technologies.join(' | '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="shrink-0 text-xs" style="color:${GREEN}">$</span>${md(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(degreeField(it.degree, it.field))}</span>${it.institution ? `<span class="text-sm text-zinc-500"> — ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate) || (lang === 'zh' ? '至今' : 'Present')}</span></div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="shrink-0 text-xs" style="color:${GREEN}">$</span>${md(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div><span class="text-xs font-bold" style="color:${ORANGE}">${esc(cat.name)}: </span><span class="text-sm text-zinc-600">${esc((cat.skills || []).join(' | '))}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-4">${((c as ProjectsContent).items || []).map((it: any) => {
      // 提取副标题字段
      const subtitle = it.role || it.url || it.company || '';

      return `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(it.name)}</span>${subtitle ? `<span class="text-sm" style="color:${BLUE}"> @ ${esc(subtitle)}</span>` : ''}</div>${it.startDate ? `<span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${it.endDate ? esc(it.endDate) : (lang === 'zh' ? '至今' : 'Present')}</span>` : ''}</div>
      ${it.description ? `<div class="mt-1 text-sm text-zinc-600">${md(it.description)}</div>` : ''}
      ${it.technologies?.length ? `<p class="mt-0.5 text-xs" style="color:${BLUE}">${lang === 'zh' ? '技术栈' : 'Tech'}: ${esc(it.technologies.join(' | '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="shrink-0 text-xs" style="color:${GREEN}">$</span>${md(h)}</li>`).join('')}</ul>` : ''}
    </div>`}).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between text-sm"><div><span class="font-semibold" style="color:${DARK}">${esc(it.name)}</span>${it.issuer ? `<span class="text-zinc-500"> — ${esc(it.issuer)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="space-y-1">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div><span class="text-xs font-bold" style="color:${ORANGE}">${esc(it.language)}: </span><span class="text-sm text-zinc-600">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'github') {
    return `<div class="space-y-3">${((c as GitHubContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-bold" style="color:${DARK}">${esc(it.name)}</span><span class="shrink-0 text-xs text-zinc-400">\u2B50 ${it.stars?.toLocaleString() ?? 0}</span></div>
      ${it.language ? `<span class="text-xs" style="color:${BLUE}">${esc(it.language)}</span>` : ''}
      ${it.description ? `<div class="mt-1 text-sm text-zinc-600">${md(it.description)}</div>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(it.title)}</span>${it.subtitle ? `<span class="text-sm text-zinc-500"> — ${esc(it.subtitle)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.description ? `<div class="mt-1 text-sm text-zinc-600">${md(it.description)}</div>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'qr_codes') return buildQrCodesHtml(section);

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-medium" style="color:${DARK}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<div class="text-sm text-zinc-600">${md(it.description)}</div>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildDeveloperHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.age, pi.politicalStatus, pi.gender, pi.ethnicity, pi.hometown, pi.maritalStatus, pi.yearsOfExperience, pi.educationLevel, pi.email, pi.phone, pi.wechat, pi.location, pi.website].filter(Boolean);
  const DARK = '#282c34';
  const GREEN = '#98c379';
  const BLUE = '#61afef';
  const ORANGE = '#e5c07b';
  const INFOWIGHT = '#abb2bf';

  const selectedFont = resume.themeConfig?.fontFamily || '"JetBrains Mono", "Fira Code", monospace';
  const fontConfig = selectedFont === 'Maple Mono NF CN'
    ? '"Maple Mono NF CN", "JetBrains Mono", monospace'
    : selectedFont;

  return `<div class="mx-auto max-w-[210mm] bg-white shadow-lg" style="font-family: ${esc(fontConfig)}">
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

          <div class="mt-2 flex flex-wrap gap-3 text-xs text-zinc-400">
            ${[pi.age, pi.politicalStatus, pi.gender, pi.ethnicity, pi.hometown, pi.maritalStatus, pi.yearsOfExperience, pi.educationLevel, pi.phone, pi.wechat, pi.location]
      .filter(Boolean)
      .map(item => `<span style="color:${INFOWIGHT}">${esc(item)}</span>`)
      .join('')}

            ${pi.email ? `
              <a href="mailto:${esc(pi.email)}" style="color:${INFOWIGHT}; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor" style="vertical-align:middle;">
                  <path d="M170.666667 128l682.666667 0q52.992 0 90.496 37.504t37.504 90.496l0 512q0 52.992-37.504 90.496t-90.496 37.504l-682.666667 0q-52.992 0-90.496-37.504t-37.504-90.496l0-512q0-52.992 37.504-90.496t90.496-37.504zM896 768l0-466.005333-357.333333 285.994667q-11.349333 9.344-26.666667 9.344t-26.666667-9.344l-357.333333-285.994667 0 466.005333q0 17.664 12.501333 30.165333t30.165333 12.501333l682.666667 0q17.664 0 30.165333-12.501333t12.501333-30.165333zM853.333333 213.333333l-682.666667 0q-6.314667 0-13.994667 2.346667l355.328 284.330667 355.328-284.330667q-7.68-2.346667-13.994667-2.346667z"></path>
                </svg>
                <span>${esc(pi.email)}</span>
              </a>
            ` : ''}

            ${pi.website ? `
              <a href="${pi.website.startsWith('http') ? esc(pi.website) : `https://github.com/${esc(pi.website)}`}"
                 target="_blank"
                 style="color:${INFOWIGHT}; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor" style="vertical-align:middle;">
                  <path d="M950.857143 512q0 143.428571-83.714286 258t-216.285714 158.571429q-15.428571 2.857143-22.571429-4t-7.142857-17.142857l0-120.571429q0-55.428571-29.714286-81.142857 32.571429-3.428571 58.571429-10.285714t53.714286-22.285714 46.285714-38 30.285714-60 11.714286-86q0-69.142857-45.142857-117.714286 21.142857-52-4.571429-116.571429-16-5.142857-46.285714 6.285714t-52.571429 25.142857l-21.714286 13.714286q-53.142857-14.857143-109.714286-14.857143t-109.714286 14.857143q-9.142857-6.285714-24.285714-15.428571t-47.714286-22-49.142857-7.714286q-25.142857 64.571429-4 116.571429-45.142857 48.571429-45.142857 117.714286 0 48.571429 11.714286 85.714286t30 60 46 38.285714 53.714286 22.285714 58.571429 10.285714q-22.857143 20.571429-28 58.857143-12 5.714286-25.714286 8.571429t-32.571429 2.857143-37.428571-12.285714-31.714286-35.714286q-10.857143-18.285714-27.714286-29.714286t-28.285714-13.714286l-11.428571-1.714286q-12 0-16.571429 2.571429t-2.857143 6.571429 5.142857 8 7.428571 6.857143l4 2.857143q12.571429 5.714286 24.857143 21.714286t18 29.142857l5.714286 13.142857q7.428571 21.714286 25.142857 35.142857t38.285714 17.142857 39.714286 4 31.714286-2l13.142857-2.285714q0 21.714286 2.857143 50.857143t2.857143 30.857143q0 10.285714-7.428571 17.142857t-22.857143 4q-132.571429-44-216.285714-158.571429t-83.714286-258q0-119.428571 58.857143-220.285714t159.714286-159.714286 220.285714-58.857143 220.285714 58.857143 159.714286 159.714286 58.857143 220.285714z"></path>
                </svg>
                <span>${esc(pi.website)}</span>
              </a>
            ` : ''}
          </div>
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