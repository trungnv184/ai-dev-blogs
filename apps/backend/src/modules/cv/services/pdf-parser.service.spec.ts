import { BadRequestException } from '@nestjs/common';
import { PDFParserService, CVErrorCode } from './pdf-parser.service';

// Mock pdf-parse to provide PDFParse constructor
const mockGetText = jest.fn();
jest.mock('pdf-parse', () => ({
  PDFParse: jest.fn().mockImplementation(() => ({
    getText: mockGetText,
  })),
}));

describe('PDFParserService', () => {
  let service: PDFParserService;

  beforeEach(() => {
    service = new PDFParserService();
    jest.clearAllMocks();
  });

  describe('extractText', () => {
    it('should extract text from a valid PDF buffer', async () => {
      const mockText = 'This is sample CV text with sufficient content for testing purposes.';
      mockGetText.mockResolvedValue({ text: mockText });

      const buffer = Buffer.from('fake pdf content');
      const result = await service.extractText(buffer);

      expect(result).toBe(mockText);
    });

    it('should throw PARSING_TIMEOUT when PDF parsing exceeds timeout', async () => {
      mockGetText.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 5000)),
      );

      const buffer = Buffer.from('fake pdf content');

      await expect(service.extractText(buffer, 100)).rejects.toThrow(
        BadRequestException,
      );

      try {
        await service.extractText(buffer, 100);
      } catch (error) {
        expect(error.response.code).toBe(CVErrorCode.PARSING_TIMEOUT);
      }
    });

    it('should throw PASSWORD_PROTECTED for encrypted PDFs', async () => {
      mockGetText.mockRejectedValue(new Error('password required'));

      const buffer = Buffer.from('encrypted pdf');

      await expect(service.extractText(buffer)).rejects.toThrow(
        BadRequestException,
      );

      try {
        await service.extractText(buffer);
      } catch (error) {
        expect(error.response.code).toBe(CVErrorCode.PASSWORD_PROTECTED);
      }
    });

    it('should throw CORRUPTED_PDF for unreadable PDFs', async () => {
      mockGetText.mockRejectedValue(new Error('invalid pdf structure'));

      const buffer = Buffer.from('corrupted pdf');

      await expect(service.extractText(buffer)).rejects.toThrow(
        BadRequestException,
      );

      try {
        await service.extractText(buffer);
      } catch (error) {
        expect(error.response.code).toBe(CVErrorCode.CORRUPTED_PDF);
      }
    });
  });

  describe('parse', () => {
    it('should throw INSUFFICIENT_DATA when text is too short', async () => {
      mockGetText.mockResolvedValue({ text: 'Short text' });

      const buffer = Buffer.from('minimal pdf');

      await expect(service.parse(buffer)).rejects.toThrow(BadRequestException);

      try {
        await service.parse(buffer);
      } catch (error) {
        expect(error.response.code).toBe(CVErrorCode.INSUFFICIENT_DATA);
      }
    });

    it('should parse a CV and return structured data', async () => {
      const cvText = `
        John Doe
        Software Engineer

        Skills:
        JavaScript, TypeScript, React, Node.js, Python

        Experience:
        Senior Software Engineer at Tech Company
        January 2020 - Present
        - Led development of microservices architecture
        - Improved system performance by 40%

        Software Developer at Startup Inc
        June 2017 - December 2019
        - Built RESTful APIs
        - Implemented CI/CD pipelines

        Education:
        Bachelor of Science in Computer Science
        State University
        2013 - 2017
      `;

      mockGetText.mockResolvedValue({ text: cvText });

      const buffer = Buffer.from('cv pdf');
      const result = await service.parse(buffer);

      expect(result).toHaveProperty('skills');
      expect(result).toHaveProperty('workHistory');
      expect(result).toHaveProperty('education');
      expect(Array.isArray(result.skills)).toBe(true);
      expect(Array.isArray(result.workHistory)).toBe(true);
      expect(Array.isArray(result.education)).toBe(true);
    });
  });

  describe('identifySkills', () => {
    it('should extract skills from a skills section', () => {
      const text = `
        About Me
        I am a developer.

        Skills:
        JavaScript, TypeScript, React
        Node.js, Python, Docker

        Experience:
        Some job
      `;

      const skills = service.identifySkills(text);

      expect(skills).toContain('JavaScript');
      expect(skills).toContain('TypeScript');
      expect(skills).toContain('React');
    });

    it('should find common skills when no skills section exists', () => {
      const text = `
        John Doe
        Software Engineer with experience in JavaScript and React development.
        I have worked with Node.js and Python for backend development.
        Experience includes Docker containerization and AWS deployment.
      `;

      const skills = service.identifySkills(text);

      expect(skills).toContain('JavaScript');
      expect(skills).toContain('React');
      expect(skills).toContain('Node.js');
      expect(skills).toContain('Python');
      expect(skills).toContain('Docker');
      expect(skills).toContain('AWS');
    });

    it('should limit skills to 50 items', () => {
      const manySkills = Array.from({ length: 60 }, (_, i) => `Skill${i}`).join(
        ', ',
      );
      const text = `
        Skills:
        ${manySkills}

        Experience:
        Some job
      `;

      const skills = service.identifySkills(text);

      expect(skills.length).toBeLessThanOrEqual(50);
    });

    it('should deduplicate skills', () => {
      const text = `
        Skills:
        JavaScript, TypeScript, JavaScript, React, React

        Experience:
        Some job
      `;

      const skills = service.identifySkills(text);
      const jsCount = skills.filter((s) => s === 'JavaScript').length;
      const reactCount = skills.filter((s) => s === 'React').length;

      expect(jsCount).toBe(1);
      expect(reactCount).toBe(1);
    });
  });

  describe('identifyWorkHistory', () => {
    it('should extract work history entries with dates', () => {
      const text = `
        Experience:
        Senior Software Engineer at Google
        January 2020 - Present
        Led development teams

        Software Developer at Microsoft
        June 2017 - December 2019
        Built web applications

        Education:
        Some degree
      `;

      const workHistory = service.identifyWorkHistory(text);

      expect(workHistory.length).toBeGreaterThan(0);
      workHistory.forEach((entry) => {
        expect(entry).toHaveProperty('id');
        expect(entry).toHaveProperty('company');
        expect(entry).toHaveProperty('role');
        expect(entry).toHaveProperty('startDate');
        expect(entry).toHaveProperty('current');
        expect(entry).toHaveProperty('highlights');
      });
    });

    it('should identify current positions', () => {
      const text = `
        Work Experience:
        Software Engineer at Company
        March 2021 - Present

        Education:
        Degree
      `;

      const workHistory = service.identifyWorkHistory(text);
      const currentPosition = workHistory.find((w) => w.current);

      expect(currentPosition).toBeDefined();
      expect(currentPosition?.current).toBe(true);
    });

    it('should limit work history to 20 entries', () => {
      const jobs = Array.from(
        { length: 25 },
        (_, i) => `
        Job ${i} at Company ${i}
        January ${2000 + i} - December ${2001 + i}
      `,
      ).join('\n');

      const text = `
        Experience:
        ${jobs}
        Education:
        Degree
      `;

      const workHistory = service.identifyWorkHistory(text);

      expect(workHistory.length).toBeLessThanOrEqual(20);
    });

    describe('badges extraction', () => {
      it('should populate badges field in work history entries', () => {
        const text = `
          Experience:
          Senior Software Engineer at Tech Corp
          January 2020 - Present
          Built microservices with TypeScript and Node.js
          Deployed to AWS using Docker

          Education:
          Degree
        `;

        const workHistory = service.identifyWorkHistory(text);

        expect(workHistory.length).toBeGreaterThan(0);
        expect(workHistory[0]).toHaveProperty('badges');
        expect(Array.isArray(workHistory[0]?.badges)).toBe(true);
      });

      it('should extract technical skills as badges', () => {
        const text = `
          Experience:
          Software Engineer at Company
          January 2020 - Present
          Developed applications using React and TypeScript
          Managed PostgreSQL databases

          Education:
          Degree
        `;

        const workHistory = service.identifyWorkHistory(text);

        expect(workHistory.length).toBeGreaterThan(0);
        const badges = workHistory[0]?.badges ?? [];
        expect(badges).toContain('React');
        expect(badges).toContain('TypeScript');
        expect(badges).toContain('PostgreSQL');
      });

      it('should extract management skills as badges', () => {
        const text = `
          Experience:
          Engineering Manager at Company
          January 2020 - Present
          Led a team of 10 engineers
          Mentored junior developers
          Conducted performance reviews

          Education:
          Degree
        `;

        const workHistory = service.identifyWorkHistory(text);

        expect(workHistory.length).toBeGreaterThan(0);
        const badges = workHistory[0]?.badges ?? [];
        expect(badges).toContain('Team Leadership');
        expect(badges).toContain('Mentoring');
        expect(badges).toContain('Performance Management');
      });

      it('should extract business skills as badges', () => {
        const text = `
          Experience:
          Product Manager at Company
          January 2020 - Present
          Increased revenue by 40%
          Managed client relationships
          Achieved highest GMV in department

          Education:
          Degree
        `;

        const workHistory = service.identifyWorkHistory(text);

        expect(workHistory.length).toBeGreaterThan(0);
        const badges = workHistory[0]?.badges ?? [];
        expect(badges).toContain('Revenue Growth');
        expect(badges).toContain('Client Management');
        expect(badges).toContain('GMV Optimization');
      });

      it('should return empty badges array when no skills found', () => {
        const text = `
          Experience:
          Office Worker at Company
          January 2020 - Present
          Did general tasks

          Education:
          Degree
        `;

        const workHistory = service.identifyWorkHistory(text);

        expect(workHistory.length).toBeGreaterThan(0);
        expect(workHistory[0]?.badges).toEqual([]);
      });

      it('should extract different badges for different work entries', () => {
        const text = `
          Experience:
          Frontend Developer at Company A
          January 2022 - Present
          Built UI with React and TypeScript

          Backend Developer at Company B
          January 2020 - December 2021
          Built APIs with Python and Django

          Education:
          Degree
        `;

        const workHistory = service.identifyWorkHistory(text);

        expect(workHistory.length).toBe(2);

        const firstEntryBadges = workHistory[0]?.badges ?? [];
        expect(firstEntryBadges).toContain('React');
        expect(firstEntryBadges).toContain('TypeScript');
        expect(firstEntryBadges).not.toContain('Python');
        expect(firstEntryBadges).not.toContain('Django');

        const secondEntryBadges = workHistory[1]?.badges ?? [];
        expect(secondEntryBadges).toContain('Python');
        expect(secondEntryBadges).toContain('Django');
        expect(secondEntryBadges).not.toContain('React');
      });
    });
  });

  describe('identifyEducation', () => {
    it('should extract education entries', () => {
      const text = `
        Experience:
        Some job

        Education:
        Bachelor of Science in Computer Science
        MIT University
        2010 - 2014

        Master of Science in Data Science
        Stanford University
        2014 - 2016
      `;

      const education = service.identifyEducation(text);

      expect(education.length).toBeGreaterThan(0);
      education.forEach((entry) => {
        expect(entry).toHaveProperty('id');
        expect(entry).toHaveProperty('institution');
        expect(entry).toHaveProperty('degree');
        expect(entry).toHaveProperty('current');
      });
    });

    it('should recognize various degree formats', () => {
      const text = `
        Education:
        B.S. in Computer Science
        Some University
        2010 - 2014

        MBA
        Business School
        2015 - 2017

        Ph.D in Physics
        Another University
        2017 - Present
      `;

      const education = service.identifyEducation(text);

      expect(education.length).toBeGreaterThan(0);
    });

    it('should limit education to 10 entries', () => {
      const degrees = Array.from(
        { length: 15 },
        (_, i) => `
        Bachelor Degree ${i}
        University ${i}
        2000 - 2004
      `,
      ).join('\n');

      const text = `
        Education:
        ${degrees}
      `;

      const education = service.identifyEducation(text);

      expect(education.length).toBeLessThanOrEqual(10);
    });
  });

  describe('extractSkillsForEntry', () => {
    // Access private method for testing
    const callExtractSkillsForEntry = (text: string): string[] => {
      return (service as any).extractSkillsForEntry(text);
    };

    describe('technical skills extraction', () => {
      it('should extract programming languages', () => {
        const text = 'Built applications using JavaScript and TypeScript with Python for data processing';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('JavaScript');
        expect(skills).toContain('TypeScript');
        expect(skills).toContain('Python');
      });

      it('should extract frameworks', () => {
        const text = 'Developed frontend with React and Angular, backend with NestJS and Express';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('React');
        expect(skills).toContain('Angular');
        expect(skills).toContain('NestJS');
        expect(skills).toContain('Express');
      });

      it('should extract cloud and DevOps technologies', () => {
        const text = 'Deployed to AWS using Docker and Kubernetes with Terraform for infrastructure';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('AWS');
        expect(skills).toContain('Docker');
        expect(skills).toContain('Kubernetes');
        expect(skills).toContain('Terraform');
      });

      it('should extract databases', () => {
        const text = 'Managed PostgreSQL and MongoDB databases with Redis for caching';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('PostgreSQL');
        expect(skills).toContain('MongoDB');
        expect(skills).toContain('Redis');
      });

      it('should be case-insensitive for technical skills', () => {
        const text = 'Used JAVASCRIPT, typescript, and REACT for frontend development';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('JavaScript');
        expect(skills).toContain('TypeScript');
        expect(skills).toContain('React');
      });
    });

    describe('management skills extraction', () => {
      it('should extract team leadership skills', () => {
        const text = 'Led a team of 5 engineers to deliver critical features';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('Team Leadership');
      });

      it('should extract team management skills', () => {
        const text = 'Managed a team of developers across multiple projects';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('Team Management');
      });

      it('should extract coaching and mentoring skills', () => {
        const text = 'Coached team members on best practices and mentored junior developers';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('Coaching');
        expect(skills).toContain('Mentoring');
      });

      it('should extract project management skills', () => {
        const text = 'Responsible for project management and stakeholder management';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('Project Management');
        expect(skills).toContain('Stakeholder Management');
      });

      it('should extract people management from direct reports', () => {
        const text = 'Had 8 direct reports and conducted performance reviews';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('People Management');
        expect(skills).toContain('Performance Management');
      });
    });

    describe('business skills extraction', () => {
      it('should extract revenue growth skills', () => {
        const text = 'Increased revenue by 30% through strategic initiatives';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('Revenue Growth');
      });

      it('should extract GMV optimization skills', () => {
        const text = 'Achieved highest GMV in the department for Q4';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('GMV Optimization');
      });

      it('should extract process optimization skills', () => {
        const text = 'Improved efficiency by streamlining workflows and automating manual processes';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('Process Optimization');
        expect(skills).toContain('Automation');
      });

      it('should extract cost reduction skills', () => {
        const text = 'Reduced costs by 25% through operational improvements';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('Cost Reduction');
      });

      it('should extract client management skills', () => {
        const text = 'Managed client relationships and ensured customer success';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('Client Management');
        expect(skills).toContain('Customer Success');
      });

      it('should extract strategic planning skills', () => {
        const text = 'Developed strategic initiatives and roadmap planning for the product';
        const skills = callExtractSkillsForEntry(text);

        expect(skills).toContain('Strategic Planning');
      });
    });

    describe('deduplication and edge cases', () => {
      it('should deduplicate skills mentioned multiple times', () => {
        const text = 'Used React for frontend. Built React components. Implemented React hooks.';
        const skills = callExtractSkillsForEntry(text);

        const reactCount = skills.filter((s) => s === 'React').length;
        expect(reactCount).toBe(1);
      });

      it('should return empty array for empty input', () => {
        const skills = callExtractSkillsForEntry('');
        expect(skills).toEqual([]);
      });

      it('should return empty array for whitespace-only input', () => {
        const skills = callExtractSkillsForEntry('   \n\t  ');
        expect(skills).toEqual([]);
      });

      it('should handle text with no matching skills', () => {
        const text = 'Did some general office work and attended meetings';
        const skills = callExtractSkillsForEntry(text);

        expect(Array.isArray(skills)).toBe(true);
      });

      it('should extract mixed skill types from realistic entry', () => {
        const text = `
          Led a team of 8 engineers building microservices with Node.js and TypeScript.
          Deployed to AWS using Docker and Kubernetes.
          Managed client relationships and increased revenue by 40%.
          Mentored junior developers on best practices.
        `;
        const skills = callExtractSkillsForEntry(text);

        // Technical
        expect(skills).toContain('Node.js');
        expect(skills).toContain('TypeScript');
        expect(skills).toContain('AWS');
        expect(skills).toContain('Docker');
        expect(skills).toContain('Kubernetes');
        expect(skills).toContain('Microservices');

        // Management
        expect(skills).toContain('Team Leadership');
        expect(skills).toContain('Mentoring');

        // Business
        expect(skills).toContain('Client Management');
        expect(skills).toContain('Revenue Growth');
      });
    });
  });
});
