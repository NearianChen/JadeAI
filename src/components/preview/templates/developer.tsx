'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent, ProjectsContent, CertificationsContent, LanguagesContent, CustomContent, GitHubContent, QrCodesContent } from '@/types/resume';
import Image from 'next/image';
import { AvatarImage } from '../avatar-image';
import { isSectionEmpty, md, degreeField } from '../utils';
import { QrCodesPreview } from '../qr-codes-preview';

const DARK = '#282c34';
const GREEN = '#98c379';
const BLUE = '#61afef';
const ORANGE = '#e5c07b';
const CONTACT_COLOR = '#abb2bf';
const EMAIL_ICON_PATH = 'M170.666667 128l682.666667 0q52.992 0 90.496 37.504t37.504 90.496l0 512q0 52.992-37.504 90.496t-90.496 37.504l-682.666667 0q-52.992 0-90.496-37.504t-37.504-90.496l0-512q0-52.992 37.504-90.496t90.496-37.504zM896 768l0-466.005333-357.333333 285.994667q-11.349333 9.344-26.666667 9.344t-26.666667-9.344l-357.333333-285.994667 0 466.005333q0 17.664 12.501333 30.165333t30.165333 12.501333l682.666667 0q17.664 0 30.165333-12.501333t12.501333-30.165333zM853.333333 213.333333l-682.666667 0q-6.314667 0-13.994667 2.346667l355.328 284.330667 355.328-284.330667q-7.68-2.346667-13.994667-2.346667z';

function getGitHubUrl(value: string): string {
  const trimmed = value.trim().replace(/^@/, '');
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^github\.com\//i.test(trimmed)) return `https://${trimmed}`;
  return `https://github.com/${trimmed}`;
}

export function DeveloperTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;
  const githubProfile = pi.github?.trim();

  return (
    <div className="mx-auto max-w-[210mm] bg-white shadow-lg" style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>
      {/* Header - terminal style */}
      <div className="px-8 py-6" style={{ background: DARK }}>
        <div className="mb-3 flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 text-xs text-zinc-500">~/resume</span>
        </div>
        <div className="flex items-center gap-4">
          {pi.avatar && (
            <AvatarImage src={pi.avatar} avatarStyle={resume.themeConfig?.avatarStyle} size={64} className="shrink-0" />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: GREEN }}>{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-0.5 text-sm" style={{ color: BLUE }}>{`// ${pi.jobTitle}`}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: CONTACT_COLOR }}>
              {pi.age && <span>{pi.age}</span>}
              {pi.politicalStatus && <span>{pi.politicalStatus}</span>}
              {pi.gender && <span>{pi.gender}</span>}
              {pi.ethnicity && <span>{pi.ethnicity}</span>}
              {pi.hometown && <span>{pi.hometown}</span>}
              {pi.maritalStatus && <span>{pi.maritalStatus}</span>}
              {pi.yearsOfExperience && <span>{pi.yearsOfExperience}</span>}
              {pi.educationLevel && <span>{pi.educationLevel}</span>}
              {pi.email && (
                <a href={`mailto:${pi.email}`} className="flex items-center gap-1 transition-colors hover:text-zinc-200">
                  <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor" aria-hidden="true" focusable="false" className="shrink-0">
                    <path d={EMAIL_ICON_PATH} />
                  </svg>
                  <span>{pi.email}</span>
                </a>
              )}
              {pi.phone && <span>{pi.phone}</span>}
              {pi.wechat && <span>{pi.wechat}</span>}
              {pi.location && <span>{pi.location}</span>}
              {pi.website && <span>{pi.website}</span>}
              {githubProfile && (
                <a
                  href={getGitHubUrl(githubProfile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-zinc-200"
                >
                  <Image src="/icons/github.svg" alt="" width={14} height={14} unoptimized className="shrink-0" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
                  <span>{githubProfile}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-6" data-section>
              <h2 className="mb-2 text-sm font-bold" style={{ color: ORANGE }}>
                {'> '}{section.title.toUpperCase()}
              </h2>
              <div className="border-l-2 pl-4" style={{ borderColor: '#3e4451' }}>
                <DeveloperSectionContent section={section} resume={resume} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function DeveloperSectionContent({ section, resume }: { section: Resume['sections'][number]; resume: Resume }) {
  const content = section.content;
  if (!content) return null;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600" dangerouslySetInnerHTML={{ __html: md((content as SummaryContent).text) }} />;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {((content as WorkExperienceContent).items || []).map((item) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: DARK }}>{item.position}</span>
                {item.company && <span className="text-sm" style={{ color: BLUE }}> @ {item.company}</span>}
              </div>
              <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium" style={{ background: '#f0f0f0', color: '#636d83' }}>
                {item.startDate} – {item.endDate || (item.current ? (resume.language === 'zh' ? '至今' : 'Present') : '')}
              </span>
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: md(item.description) }} />}
            {item.technologies?.length > 0 && (
              <p className="mt-0.5 text-xs" style={{ color: BLUE }}>{resume.language === 'zh' ? '技术栈' : 'Tech'}: {item.technologies.join(' | ')}</p>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="shrink-0 text-xs" style={{ color: GREEN }}>$</span>
                    <span style={{ minWidth: 0, flex: 1, overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: md(h) }} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'education') {
    return (
      <div className="space-y-3">
        {((content as EducationContent).items || []).map((item) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: DARK }}>{degreeField(item.degree, item.field)}</span>
                {item.institution && <span className="text-sm text-zinc-500"> — {item.institution}</span>}
              </div>
              <span className="shrink-0 text-xs text-zinc-400">{item.startDate} – {item.endDate || (resume.language === 'zh' ? '至今' : 'Present')}</span>
            </div>
            {item.gpa && <p className="text-sm text-zinc-500">GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="shrink-0 text-xs" style={{ color: GREEN }}>$</span>
                    <span style={{ minWidth: 0, flex: 1, overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: md(h) }} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'skills') {
    return (
      <div className="space-y-2">
        {((content as SkillsContent).categories || []).map((cat) => (
          <div key={cat.id}>
            <span className="text-xs font-bold" style={{ color: ORANGE }}>{cat.name}: </span>
            <span className="text-sm text-zinc-600">{(cat.skills || []).join(' | ')}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'projects') {
    const items = (content as ProjectsContent).items || [];
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: DARK }}>{item.name}</span>
              </div>
              {item.startDate && (
                <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium" style={{ background: '#f0f0f0', color: '#636d83' }}>
                  {item.startDate} – {item.endDate || (resume.language === 'zh' ? '至今' : 'Present')}
                </span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: md(item.description) }} />}
            {item.technologies?.length > 0 && (
              <p className="mt-0.5 text-xs" style={{ color: BLUE }}>{resume.language === 'zh' ? '技术栈' : 'Tech'}: {item.technologies.join(' | ')}</p>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="shrink-0 text-xs" style={{ color: GREEN }}>$</span>
                    <span style={{ minWidth: 0, flex: 1, overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: md(h) }} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'certifications') {
    const items = (content as CertificationsContent).items || [];
    return (
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-baseline justify-between text-sm">
            <div>
              <span className="font-semibold" style={{ color: DARK }}>{item.name}</span>
              {item.issuer && <span className="text-zinc-500"> — {item.issuer}</span>}
            </div>
            {item.date && <span className="shrink-0 text-xs text-zinc-400">{item.date}</span>}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.id}>
            <span className="text-xs font-bold" style={{ color: ORANGE }}>{item.language}: </span>
            <span className="text-sm text-zinc-600">{item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'github') {
    const items = (content as GitHubContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold" style={{ color: DARK }}>{item.name}</span>
              <span className="shrink-0 text-xs text-zinc-400">{'\u2B50'} {item.stars?.toLocaleString()}</span>
            </div>
            {item.language && <span className="text-xs" style={{ color: BLUE }}>{item.language}</span>}
            {item.description && <p className="mt-1 text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: md(item.description) }} />}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    const items = (content as CustomContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: DARK }}>{item.title}</span>
                {item.subtitle && <span className="text-sm text-zinc-500"> — {item.subtitle}</span>}
              </div>
              {item.date && <span className="shrink-0 text-xs text-zinc-400">{item.date}</span>}
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: md(item.description) }} />}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'qr_codes') {
    return <QrCodesPreview items={(content as QrCodesContent).items || []} />;
  }

  if ('items' in content && content.items) {
    const items = content.items as Array<{ id: string; name?: string; title?: string; language?: string; description?: string }>;
    return (
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id}>
            <span className="text-sm font-medium" style={{ color: DARK }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: md(item.description) }} />}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
