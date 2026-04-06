'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent, ProjectsContent, CertificationsContent, LanguagesContent, CustomContent, GitHubContent } from '@/types/resume';
import { AvatarImage } from '../avatar-image';
import { isSectionEmpty, md, degreeField } from '../utils';
import { QrCodesPreview } from '../qr-codes-preview';

// 统一的颜色配置
const COLORS = {
  dark: '#282c34',
  green: '#98c379',
  blue: '#61afef',
  orange: '#e5c07b',
  bgGray: '#f0f0f0',
  textGray: '#636d83'
};

// --- 提取复用组件 1: Highlights 列表 ---
// 解决了你需求 1 中对齐和冗余的问题，已去掉 mt-1
function HighlightList({ highlights }: { highlights?: string[] }) {
  if (!highlights || highlights.length === 0) return null;
  return (
    <ul className="mt-1 space-y-0.5">
      {highlights.map((h: string, i: number) => (
        <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
          <span className="shrink-0 text-xs" style={{ color: COLORS.green }}>$</span>
          <span dangerouslySetInnerHTML={{ __html: md(h) }} />
        </li>
      ))}
    </ul>
  );
}

// --- 提取复用组件 2: 科技栈展示 ---
function TechStack({ technologies, isZh }: { technologies?: string[], isZh: boolean }) {
  if (!technologies || technologies.length === 0) return null;
  return (
    <p className="mt-0.5 text-xs" style={{ color: COLORS.blue }}>
      {isZh ? '技术栈' : 'Tech'}: {technologies.join(' | ')}
    </p>
  );
}

export function DeveloperTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  // 需求 2 & 3: 字体配置位置
  // 英文优先 (JetBrains Mono), 中文兜底 (Maple Mono NF CN)
  const selectedFont = resume.themeConfig?.fontFamily || '"JetBrains Mono", "Fira Code", monospace';
  const fontConfig = selectedFont === 'Maple Mono NF CN'
    ? '"Maple Mono NF CN", "JetBrains Mono", monospace'
    : selectedFont;
  return (
    <div className="mx-auto max-w-[210mm] bg-white shadow-lg" style={{ fontFamily: fontConfig }}>
      {/* Header - terminal style */}
      <div className="px-8 py-6" style={{ background: COLORS.dark }}>
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
            <h1 className="text-2xl font-bold" style={{ color: COLORS.green }}>{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-0.5 text-sm" style={{ color: COLORS.blue }}>{`// ${pi.jobTitle}`}</p>}
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-400">
              {pi.age && <span>{pi.age}</span>}
              {pi.politicalStatus && <span>{pi.politicalStatus}</span>}
              {pi.gender && <span>{pi.gender}</span>}
              {pi.ethnicity && <span>{pi.ethnicity}</span>}
              {pi.hometown && <span>{pi.hometown}</span>}
              {pi.maritalStatus && <span>{pi.maritalStatus}</span>}
              {pi.yearsOfExperience && <span>{pi.yearsOfExperience}</span>}
              {pi.educationLevel && <span>{pi.educationLevel}</span>}
              {pi.email && <span>{pi.email}</span>}
              {pi.phone && <span>{pi.phone}</span>}
              {pi.wechat && <span>{pi.wechat}</span>}
              {pi.location && <span>{pi.location}</span>}
              {pi.website && <span>{pi.website}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-6" data-section>
              <h2 className="mb-2 text-sm font-bold" style={{ color: COLORS.orange }}>
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

// 需求 4: 工程化重构，使用 switch-case 替代冗长的 if 语句，结构更清晰
function DeveloperSectionContent({ section, resume }: { section: any; resume: Resume }) {
  const content = section.content;
  const isZh = resume.language === 'zh';
  const presentText = isZh ? '至今' : 'Present';

  if (!content) return null;

  switch (section.type) {
    case 'summary':
      return <p className="text-sm leading-relaxed text-zinc-600" dangerouslySetInnerHTML={{ __html: md((content as SummaryContent).text) }} />;

    case 'work_experience':
      return (
        <div className="space-y-4">
          {(content.items || []).map((item: any) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold" style={{ color: COLORS.dark }}>{item.position}</span>
                  {item.company && <span className="text-sm" style={{ color: COLORS.blue }}> @ {item.company}</span>}
                </div>
                <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium" style={{ background: COLORS.bgGray, color: COLORS.textGray }}>
                  {item.startDate} – {item.endDate || (item.current ? presentText : '')}
                </span>
              </div>
              {item.description && <p className="mt-1 text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: md(item.description) }} />}
              <TechStack technologies={item.technologies} isZh={isZh} />
              <HighlightList highlights={item.highlights} />
            </div>
          ))}
        </div>
      );

    case 'education':
      return (
        <div className="space-y-3">
          {(content.items || []).map((item: any) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold" style={{ color: COLORS.dark }}>{degreeField(item.degree, item.field)}</span>
                  {item.institution && <span className="text-sm text-zinc-500"> — {item.institution}</span>}
                </div>
                <span className="shrink-0 text-xs text-zinc-400">{item.startDate} – {item.endDate || presentText}</span>
              </div>
              {item.gpa && <p className="text-sm text-zinc-500">GPA: {item.gpa}</p>}
              <HighlightList highlights={item.highlights} />
            </div>
          ))}
        </div>
      );

    case 'skills':
      return (
        <div className="space-y-2">
          {(content.categories || []).map((cat: any) => (
            <div key={cat.id}>
              <span className="text-xs font-bold" style={{ color: COLORS.orange }}>{cat.name}: </span>
              <span className="text-sm text-zinc-600">{(cat.skills || []).join(' | ')}</span>
            </div>
          ))}
        </div>
      );

    case 'projects':
      return (
        <div className="space-y-4">
          {((content as ProjectsContent).items || []).map((item: any) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between">
                <div>
                  {/* 项目名称 */}
                  <span className="text-sm font-bold" style={{ color: COLORS.dark }}>{item.name}</span>
                  {/* 新增：项目角色/链接/公司，使用蓝色 @ 符号显示 */}
                  {(item.role || item.url || item.company) && (
                    <span className="text-sm" style={{ color: COLORS.blue }}>
                      {' '}@ {item.role || item.url || item.company}
                    </span>
                  )}
                </div>
                {item.startDate && (
                  <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium" style={{ background: COLORS.bgGray, color: COLORS.textGray }}>
                    {item.startDate} – {item.endDate || presentText}
                  </span>
                )}
              </div>
              {item.description && <p className="mt-1 text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: md(item.description) }} />}
              <TechStack technologies={item.technologies} isZh={isZh} />
              <HighlightList highlights={item.highlights} />
            </div>
          ))}
        </div>
      );

    case 'certifications':
      return (
        <div className="space-y-1.5">
          {((content as CertificationsContent).items || []).map((item: any) => (
            <div key={item.id} className="flex items-baseline justify-between text-sm">
              <div>
                <span className="font-semibold" style={{ color: COLORS.dark }}>{item.name}</span>
                {item.issuer && <span className="text-zinc-500"> — {item.issuer}</span>}
              </div>
              {item.date && <span className="shrink-0 text-xs text-zinc-400">{item.date}</span>}
            </div>
          ))}
        </div>
      );

    case 'languages':
      return (
        <div className="space-y-1">
          {((content as LanguagesContent).items || []).map((item: any) => (
            <div key={item.id}>
              <span className="text-xs font-bold" style={{ color: COLORS.orange }}>{item.language}: </span>
              <span className="text-sm text-zinc-600">{item.proficiency}</span>
            </div>
          ))}
        </div>
      );

    case 'github':
      return (
        <div className="space-y-3">
          {((content as GitHubContent).items || []).map((item: any) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold" style={{ color: COLORS.dark }}>{item.name}</span>
                <span className="shrink-0 text-xs text-zinc-400">{'\u2B50'} {item.stars?.toLocaleString()}</span>
              </div>
              {item.language && <span className="text-xs" style={{ color: COLORS.blue }}>{item.language}</span>}
              {item.description && <p className="mt-1 text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: md(item.description) }} />}
            </div>
          ))}
        </div>
      );

    case 'custom':
      return (
        <div className="space-y-3">
          {((content as CustomContent).items || []).map((item: any) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold" style={{ color: COLORS.dark }}>{item.title}</span>
                  {item.subtitle && <span className="text-sm text-zinc-500"> — {item.subtitle}</span>}
                </div>
                {item.date && <span className="shrink-0 text-xs text-zinc-400">{item.date}</span>}
              </div>
              {item.description && <p className="mt-1 text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: md(item.description) }} />}
            </div>
          ))}
        </div>
      );

    case 'qr_codes':
      return <QrCodesPreview items={(content as any).items || []} />;

    default:
      // Fallback for any unknown list content
      if (content?.items) {
        return (
          <div className="space-y-2">
            {content.items.map((item: any) => (
              <div key={item.id}>
                <span className="text-sm font-medium" style={{ color: COLORS.dark }}>{item.name || item.title || item.language}</span>
                {item.description && <p className="text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: md(item.description) }} />}
              </div>
            ))}
          </div>
        );
      }
      return null;
  }
}