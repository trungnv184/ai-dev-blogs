import { Injectable, BadRequestException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PDFParse } = require('pdf-parse');
import { v4 as uuidv4 } from 'uuid';

/**
 * CV Error codes for PDF parsing
 */
export enum CVErrorCode {
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  PASSWORD_PROTECTED = 'PASSWORD_PROTECTED',
  CORRUPTED_PDF = 'CORRUPTED_PDF',
  PARSING_TIMEOUT = 'PARSING_TIMEOUT',
  PARSING_FAILED = 'PARSING_FAILED',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  CV_NOT_FOUND = 'CV_NOT_FOUND',
  UPLOAD_IN_PROGRESS = 'UPLOAD_IN_PROGRESS',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export interface ParsedWorkHistoryEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  highlights: string[];
  location?: string;
  badges: string[];
}

export interface ParsedEducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface ParsedCVData {
  skills: string[];
  workHistory: ParsedWorkHistoryEntry[];
  education: ParsedEducationEntry[];
}

const SECTION_PATTERNS = {
  skills:
    /^(?:skills|technical skills|competencies|technologies|core competencies)[\s:]*$/i,
  experience:
    /^(?:employment history|work history|employment|professional experience|work experience|experience)[\s:]*$/i,
  education: /^(?:education|academic|qualifications|degrees|certifications)[\s:]*$/i,
};

const DATE_PATTERNS = [
  // Standard date formats: "June 2022 - Present", "January 2020 - December 2021"
  /(\w+\s+\d{4})\s*[-–—]\s*(\w+\s+\d{4}|present|current|now)/gi,
  // Numeric date formats: "01/2022 - 12/2023"
  /(\d{2}\/\d{4})\s*[-–—]\s*(\d{2}\/\d{4}|present|current|now)/gi,
  // Year only formats: "2020 - 2023"
  /(\d{4})\s*[-–—]\s*(\d{4}|present|current|now)/gi,
  // Spaced character formats: "J U N E 2 0 2 2 — P R E S E N T" (PDF extraction artifact)
  /([A-Z]\s*[A-Z]\s*[A-Z]+(?:\s*[A-Z])*\s+\d\s*\d\s*\d\s*\d)\s*[-–—]\s*([A-Z]\s*[A-Z]\s*[A-Z]+(?:\s*[A-Z])*\s+\d\s*\d\s*\d\s*\d|P\s*R\s*E\s*S\s*E\s*N\s*T|C\s*U\s*R\s*R\s*E\s*N\s*T|N\s*O\s*W)/gi,
];

const MIN_TEXT_LENGTH = 100;
const DEFAULT_TIMEOUT_MS = 60000;

/**
 * Comprehensive list of technical skills for exact-match extraction
 */
const TECHNICAL_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C#', 'C++',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'Elixir', 'Dart', 'R',
  // Frontend Frameworks
  'React', 'Angular', 'Vue', 'Vue.js', 'Next.js', 'Nuxt', 'Svelte', 'Remix',
  // Backend Frameworks
  'Node.js', 'NestJS', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring', 'Spring Boot',
  'Laravel', 'Rails', 'Ruby on Rails', '.NET', 'ASP.NET',
  // Cloud Platforms
  'AWS', 'GCP', 'Google Cloud', 'Azure', 'Heroku', 'Vercel', 'Netlify',
  // DevOps & Infrastructure
  'Docker', 'Kubernetes', 'K8s', 'Terraform', 'Ansible', 'Jenkins',
  'GitHub Actions', 'GitLab CI', 'CI/CD', 'CircleCI',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB',
  'Cassandra', 'SQLite', 'Oracle', 'SQL Server', 'Firebase',
  // Other Technologies
  'GraphQL', 'REST', 'gRPC', 'Kafka', 'RabbitMQ', 'WebSocket',
  'Microservices', 'Serverless', 'Lambda',
  // Methodologies
  'Agile', 'Scrum', 'Kanban', 'TDD', 'BDD',
  // Tools
  'Git', 'Jira', 'Confluence', 'Figma', 'Webpack', 'Vite',
];

/**
 * Management/leadership skill patterns with regex and resulting skill name
 */
const MANAGEMENT_SKILL_PATTERNS: { pattern: RegExp; skill: string }[] = [
  { pattern: /\b(lead|leading|led)\s+(a\s+)?team/i, skill: 'Team Leadership' },
  { pattern: /\b(manage|managing|managed)\s+(a\s+)?team/i, skill: 'Team Management' },
  { pattern: /\bteam\s+of\s+\d+/i, skill: 'Team Leadership' },
  { pattern: /\bdirect\s+reports?\b/i, skill: 'People Management' },
  { pattern: /\b(coach|coaching|coached)\s+(team|members?|engineers?|developers?)/i, skill: 'Coaching' },
  { pattern: /\b(mentor|mentoring|mentored)/i, skill: 'Mentoring' },
  { pattern: /\b(train|training|trained)\s+(team|members?|staff)/i, skill: 'Training' },
  { pattern: /\bproject\s+manag(er|ement|ing)/i, skill: 'Project Management' },
  { pattern: /\bprogram\s+manag(er|ement|ing)/i, skill: 'Program Management' },
  { pattern: /\bstakeholder\s+manag(ement|ing)/i, skill: 'Stakeholder Management' },
  { pattern: /\b(spearhead|spearheaded|spearheading)/i, skill: 'Leadership' },
  { pattern: /\b(lead|led)\s+(initiative|project|effort)/i, skill: 'Leadership' },
  { pattern: /\bcross[- ]functional\s+(team|collaboration)/i, skill: 'Cross-functional Leadership' },
  { pattern: /\bpeople\s+manag(er|ement|ing)/i, skill: 'People Management' },
  { pattern: /\bperformance\s+review/i, skill: 'Performance Management' },
  { pattern: /\bhiring|recruited|interviewing\s+candidates/i, skill: 'Hiring' },
];

/**
 * Business/achievement skill patterns with regex and resulting skill name
 */
const BUSINESS_SKILL_PATTERNS: { pattern: RegExp; skill: string }[] = [
  // Revenue & Growth
  { pattern: /\b(increas|grew|grow|boost|drove|drive)\w*\s+(revenue|sales|gmv)/i, skill: 'Revenue Growth' },
  { pattern: /\bhighest\s+gmv\b/i, skill: 'GMV Optimization' },
  { pattern: /\b\d+%\s+(growth|increase|improvement)/i, skill: 'Performance Improvement' },
  { pattern: /\b(revenue|sales)\s+(growth|increase)/i, skill: 'Revenue Growth' },
  { pattern: /\bgenerat(ed|ing)\s+(revenue|\$|\d+)/i, skill: 'Revenue Generation' },
  // Cost & Efficiency
  { pattern: /\b(reduc|cut|lower)\w*\s+(cost|expense|spending)/i, skill: 'Cost Reduction' },
  { pattern: /\b(improv|optimiz|enhanc)\w*\s+(efficiency|performance|productivity)/i, skill: 'Process Optimization' },
  { pattern: /\bstreamlin(ed|ing)/i, skill: 'Process Optimization' },
  { pattern: /\bautomat(ed?|ing|ion)\b/i, skill: 'Automation' },
  // Client & Customer
  { pattern: /\bclient\s+(relationship|management|engagement)/i, skill: 'Client Management' },
  { pattern: /\bcustomer\s+(success|satisfaction|experience)/i, skill: 'Customer Success' },
  { pattern: /\baccount\s+manag(er|ement|ing)/i, skill: 'Account Management' },
  { pattern: /\bbusiness\s+development/i, skill: 'Business Development' },
  // Strategy & Planning
  { pattern: /\bstrategic\s+(plan|initiative|direction)/i, skill: 'Strategic Planning' },
  { pattern: /\broadmap\s+(develop|creat|defin)/i, skill: 'Roadmap Planning' },
  { pattern: /\bbudget\s+(manag|plan|allocat)/i, skill: 'Budget Management' },
  // Delivery & Results
  { pattern: /\bdeliver(ed|ing)\s+(on[- ]time|ahead|under\s+budget)/i, skill: 'Delivery Excellence' },
  { pattern: /\blaunch(ed|ing)\s+(product|feature|service)/i, skill: 'Product Launch' },
  { pattern: /\bscal(ed|ing)\s+(system|team|operation)/i, skill: 'Scaling' },
];

@Injectable()
export class PDFParserService {
  async parse(
    buffer: Buffer,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
  ): Promise<ParsedCVData> {
    const text = await this.extractText(buffer, timeoutMs);

    console.log('=== PDF Parser Debug ===');
    console.log('Extracted text length:', text.length);
    console.log('First 2000 chars of extracted text:', text.substring(0, 2000));
    console.log('=== End PDF Parser Debug ===');

    if (text.length < MIN_TEXT_LENGTH) {
      throw new BadRequestException({
        code: CVErrorCode.INSUFFICIENT_DATA,
        message:
          'Limited text could be extracted. This appears to be a scanned document. Please upload a text-based PDF or enter information manually.',
      });
    }

    const skills = this.identifySkills(text);
    const workHistory = this.identifyWorkHistory(text);
    const education = this.identifyEducation(text);

    return {
      skills,
      workHistory,
      education,
    };
  }

  async extractText(
    buffer: Buffer,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(
          new BadRequestException({
            code: CVErrorCode.PARSING_TIMEOUT,
            message: 'PDF processing timed out. Please try a smaller file.',
          }),
        );
      }, timeoutMs);

      const parser = new PDFParse({ data: buffer });
      parser.getText()
        .then((data: { text: string }) => {
          clearTimeout(timeoutId);
          resolve(data.text);
        })
        .catch((error: Error) => {
          clearTimeout(timeoutId);

          if (
            error.message?.includes('password') ||
            error.message?.includes('encrypted')
          ) {
            reject(
              new BadRequestException({
                code: CVErrorCode.PASSWORD_PROTECTED,
                message:
                  'Cannot process password-protected PDFs. Please upload an unprotected file.',
              }),
            );
          } else {
            reject(
              new BadRequestException({
                code: CVErrorCode.CORRUPTED_PDF,
                message:
                  'Unable to read PDF file. Please ensure the file is not corrupted.',
              }),
            );
          }
        });
    });
  }

  identifySkills(text: string): string[] {
    const skills: string[] = [];
    const lines = text.split('\n');

    let inSkillsSection = false;
    let skillsSectionEnd = false;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (SECTION_PATTERNS.skills.test(trimmedLine)) {
        inSkillsSection = true;
        continue;
      }

      if (inSkillsSection) {
        if (
          SECTION_PATTERNS.experience.test(trimmedLine) ||
          SECTION_PATTERNS.education.test(trimmedLine)
        ) {
          skillsSectionEnd = true;
          break;
        }

        const skillCandidates = trimmedLine
          .split(/[,;•·|]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 1 && s.length < 50);

        skills.push(...skillCandidates);
      }
    }

    if (!inSkillsSection || skillsSectionEnd === false) {
      const commonSkills = [
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'Python',
        'Java',
        'SQL',
        'AWS',
        'Docker',
        'Git',
        'HTML',
        'CSS',
        'Angular',
        'Vue',
        'MongoDB',
        'PostgreSQL',
        'Redis',
        'Kubernetes',
        'GraphQL',
        'REST',
      ];

      for (const skill of commonSkills) {
        if (text.toLowerCase().includes(skill.toLowerCase()) && !skills.includes(skill)) {
          skills.push(skill);
        }
      }
    }

    return [...new Set(skills)].slice(0, 50);
  }

  identifyWorkHistory(text: string): ParsedWorkHistoryEntry[] {
    const workHistory: ParsedWorkHistoryEntry[] = [];
    const lines = text.split('\n');

    console.log('=== Work History Parser Debug ===');
    console.log('Total lines:', lines.length);

    let inExperienceSection = false;
    const entryStartIndices: number[] = [];

    // First pass: find all entry start positions and section boundaries
    let experienceSectionStart = -1;
    let experienceSectionEnd = lines.length;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim() ?? '';

      if (SECTION_PATTERNS.experience.test(line)) {
        inExperienceSection = true;
        experienceSectionStart = i;
        console.log('Found experience section at line', i, ':', line);
        continue;
      }

      if (
        inExperienceSection &&
        (SECTION_PATTERNS.education.test(line) ||
          SECTION_PATTERNS.skills.test(line))
      ) {
        experienceSectionEnd = i;
        console.log('Experience section ends at line', i, ':', line);
        break;
      }

      if (inExperienceSection && line.length > 0) {
        for (const pattern of DATE_PATTERNS) {
          if (pattern.test(line)) {
            console.log('Found date pattern at line', i, ':', line);
            entryStartIndices.push(i);
            break;
          }
        }
      }
    }

    console.log('Experience section found:', inExperienceSection);
    console.log('Experience section start:', experienceSectionStart);
    console.log('Experience section end:', experienceSectionEnd);
    console.log('Entry start indices:', entryStartIndices);
    console.log('=== End Work History Parser Debug ===');

    // Second pass: extract entries with their full text blocks
    for (let idx = 0; idx < entryStartIndices.length; idx++) {
      const startIdx = entryStartIndices[idx] as number;
      const endIdx = entryStartIndices[idx + 1] ?? experienceSectionEnd;
      const line = lines[startIdx]?.trim() ?? '';

      // Capture the text block for this entry (from start to next entry or section end)
      const entryTextLines: string[] = [];
      for (let j = startIdx; j < endIdx; j++) {
        const entryLine = lines[j]?.trim() ?? '';
        if (entryLine.length > 0) {
          entryTextLines.push(entryLine);
        }
      }
      const entryTextBlock = entryTextLines.join(' ');

      for (const pattern of DATE_PATTERNS) {
        const match = pattern.exec(line);
        if (match) {
          const entry: ParsedWorkHistoryEntry = {
            id: uuidv4(),
            company: this.extractCompanyFromLine(line, lines, startIdx),
            role: this.extractRoleFromLine(line, lines, startIdx),
            startDate: match[1] ?? '',
            endDate: this.isCurrentPosition(match[2] ?? '')
              ? undefined
              : match[2],
            current: this.isCurrentPosition(match[2] ?? ''),
            highlights: [],
            description: '',
            badges: this.extractSkillsForEntry(entryTextBlock),
          };

          if (entry.company || entry.role) {
            workHistory.push(entry);
          }
          break;
        }
      }
    }

    return workHistory.slice(0, 20);
  }

  identifyEducation(text: string): ParsedEducationEntry[] {
    const education: ParsedEducationEntry[] = [];
    const lines = text.split('\n');

    let inEducationSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim() ?? '';

      if (SECTION_PATTERNS.education.test(line)) {
        inEducationSection = true;
        continue;
      }

      if (
        inEducationSection &&
        (SECTION_PATTERNS.experience.test(line) ||
          SECTION_PATTERNS.skills.test(line))
      ) {
        break;
      }

      if (inEducationSection && line.length > 0) {
        const degreePatterns = [
          /\b(Bachelor|Master|PhD|Ph\.D|B\.S|M\.S|B\.A|M\.A|MBA|BSc|MSc)\b/i,
        ];

        for (const pattern of degreePatterns) {
          if (pattern.test(line)) {
            const entry: ParsedEducationEntry = {
              id: uuidv4(),
              institution: this.extractInstitution(line, lines, i),
              degree: this.extractDegree(line),
              field: this.extractField(line),
              startDate: '',
              endDate: '',
              current: false,
            };

            for (const datePattern of DATE_PATTERNS) {
              const match = datePattern.exec(line);
              if (match) {
                entry.startDate = match[1] ?? '';
                entry.endDate = match[2];
                entry.current = this.isCurrentPosition(match[2] ?? '');
                break;
              }
            }

            if (entry.institution || entry.degree) {
              education.push(entry);
            }
            break;
          }
        }
      }
    }

    return education.slice(0, 10);
  }

  private extractCompanyFromLine(
    line: string,
    lines: string[],
    index: number,
  ): string {
    const companyPatterns = [
      /(?:at|@)\s+([A-Z][A-Za-z\s&.]+)/,
      /([A-Z][A-Za-z\s&.]+)(?:\s*[-–—|])/,
    ];

    for (const pattern of companyPatterns) {
      const match = pattern.exec(line);
      if (match?.[1]) {
        return match[1].trim();
      }
    }

    const prevLine = lines[index - 1]?.trim() ?? '';
    if (prevLine && !DATE_PATTERNS.some((p) => p.test(prevLine))) {
      return prevLine.slice(0, 100);
    }

    return '';
  }

  private extractRoleFromLine(
    line: string,
    lines: string[],
    index: number,
  ): string {
    const rolePatterns = [
      /^([A-Z][A-Za-z\s]+(?:Engineer|Developer|Manager|Director|Lead|Architect|Designer|Analyst))/i,
      /(?:as|position:?)\s+([A-Za-z\s]+)/i,
    ];

    for (const pattern of rolePatterns) {
      const match = pattern.exec(line);
      if (match?.[1]) {
        return match[1].trim();
      }
    }

    const prevLine = lines[index - 1]?.trim() ?? '';
    const roleKeywords = [
      'engineer',
      'developer',
      'manager',
      'lead',
      'architect',
      'designer',
      'analyst',
      'consultant',
    ];
    if (
      prevLine &&
      roleKeywords.some((k) => prevLine.toLowerCase().includes(k))
    ) {
      return prevLine.slice(0, 100);
    }

    return '';
  }

  private extractInstitution(
    line: string,
    lines: string[],
    index: number,
  ): string {
    const universityPatterns = [
      /([A-Z][A-Za-z\s]+(?:University|College|Institute|School))/i,
    ];

    for (const pattern of universityPatterns) {
      const match = pattern.exec(line);
      if (match?.[1]) {
        return match[1].trim();
      }
    }

    const prevLine = lines[index - 1]?.trim() ?? '';
    if (prevLine && /university|college|institute/i.test(prevLine)) {
      return prevLine.slice(0, 100);
    }

    return '';
  }

  private extractDegree(line: string): string {
    const degreeMatch =
      /\b(Bachelor(?:'s)?|Master(?:'s)?|PhD|Ph\.D|B\.S\.?|M\.S\.?|B\.A\.?|M\.A\.?|MBA|BSc|MSc)[^,]*/i.exec(
        line,
      );
    return degreeMatch?.[0]?.trim() ?? '';
  }

  private extractField(line: string): string {
    const fieldMatch = /(?:in|of)\s+([A-Za-z\s]+?)(?:\s*[-–—,|]|$)/i.exec(line);
    return fieldMatch?.[1]?.trim() ?? '';
  }

  private isCurrentPosition(dateStr: string): boolean {
    return /present|current|now/i.test(dateStr);
  }

  /**
   * Extract skills from a work history entry's text block.
   * Matches technical skills (exact match), management skills (pattern), and business skills (pattern).
   * Returns deduplicated array of skill names.
   */
  private extractSkillsForEntry(text: string): string[] {
    const skills: string[] = [];

    if (!text || text.trim().length === 0) {
      return skills;
    }

    const lowerText = text.toLowerCase();

    // Extract technical skills (case-insensitive matching)
    for (const skill of TECHNICAL_SKILLS) {
      const lowerSkill = skill.toLowerCase();
      // For short skills (<=2 chars) or single words, use word boundary matching
      // For skills with special chars (dots, etc.), use includes with context check
      if (skill.length <= 2) {
        // Use strict word boundary for very short skills like "R", "Go"
        const pattern = new RegExp(`\\b${skill}\\b`, 'i');
        if (pattern.test(text)) {
          skills.push(skill);
        }
      } else if (lowerText.includes(lowerSkill)) {
        // For longer skills, simple includes is sufficient
        skills.push(skill);
      }
    }

    // Extract management skills (regex pattern matching)
    for (const { pattern, skill } of MANAGEMENT_SKILL_PATTERNS) {
      if (pattern.test(text)) {
        skills.push(skill);
      }
    }

    // Extract business skills (regex pattern matching)
    for (const { pattern, skill } of BUSINESS_SKILL_PATTERNS) {
      if (pattern.test(text)) {
        skills.push(skill);
      }
    }

    // Deduplicate and return
    return [...new Set(skills)];
  }
}
