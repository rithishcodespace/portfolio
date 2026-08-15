export const portfolioData = {
  header: {
    logo: ' Rithish.dev',
    navLinks: [
      { id: 'home', label: '~/' },
      { id: 'about', label: 'about' },
      { id: 'skills', label: 'skills' },
      { id: 'exp', label: 'experience' },
      { id: 'projects', label: 'projects' },
      { id: 'achievements', label: 'achievements' },
      { id: 'edu', label: 'education' },
      { id: 'contact', label: 'contact' },
    ],
  },

  hero: {
    command: './init_session.sh --user=rithish',
    name: '<Rithish S/>',
    title: 'Backend Engineer | Distributed Systems | Cloud & DevOps',
    tagline:
      'Building scalable backend systems, distributed services, and production-ready developer tools',
    buttons: [
      {
        label: 'PROJECTS',
        href: '#projects',
        type: 'projects',
        icon: 'zap',
      },
      {
        label: 'CONTACT',
        href: '#contact',
        type: 'contact',
        icon: 'terminal',
      },
      {
        label: 'RESUME.PDF',
        href: '/resume.pdf',
        type: 'resume',
        icon: 'fileText',
      },
      {
        label: 'GITHUB',
        href: 'https://github.com/rithishcodespace',
        type: 'github',
        icon: 'github',
      },
    ],
  },

  about: {
    headingCommand: 'cat /profile/summary.md',

    profile: {
      fileName: 'avatar.png',
      avatarUrl: '/avatar.png',
      name: 'Rithish S',
      role: 'Computer Science & Engineering Student',
      location: 'Tamil Nadu, India',
      email: 'rithishcodespace@gmail.com',

      socials: [
        {
          label: 'rithishcodespace',
          url: 'https://github.com/rithishcodespace',
          icon: 'github',
        },
        {
          label: 'LinkedIn',
          url: 'https://www.linkedin.com/in/rithish-saravanan-32a39431a/',
          icon: 'linkedin',
        },
        {
          label: 'LeetCode',
          url: 'https://leetcode.com/rithishcodespace',
          icon: 'code',
        },
      ],

      // Back of Image Card: human.txt
      humanTxt: {
        fileName: 'human.txt',
        likes: [
          'clean APIs',
          'late-night debugging',
          'system design',
          'building weird prototypes',
          'understanding internals',
        ],
        dislikes: [
          'unnecessary abstractions',
          'copy-paste engineering',
          'code that "just works"',
          'things I don\'t understand',
        ],
        defaultMode: ['BUILD', 'BREAK', 'DEBUG', 'LEARN'],
      },
    },

    summary: {
      fileName: 'summary.log',

      text:
        '[INFO] Backend-focused software engineer and Computer Science student specializing in Node.js, TypeScript, REST APIs, distributed systems, databases, and cloud-native development. Experienced in building production-ready backend services, developer tools, scalable architectures, and full-stack applications using Docker, Kubernetes, Redis, PostgreSQL, AWS, and CI/CD.',

      highlightKeywords: [
        'Node.js',
        'TypeScript',
        'Distributed Systems',
        'Cloud & DevOps',
      ],

      skills: [
        'Node.js',
        'TypeScript',
        'Express.js',
        'Python',
        'FastAPI',
        'REST APIs',
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Redis',
        'Docker',
        'Kubernetes',
        'AWS',
        'GitHub Actions',
        'Prometheus',
        'Grafana',
        'Prisma ORM',
        'System Design',
        'DSA',
      ],

      // Back of Summary Card: activity.log
      activityLog: {
        fileName: 'activity.log',
        title: 'RECENT ACTIVITY',
        timeline: [
          {
            year: '2024',
            items: [
              { label: 'Started programming seriously', sub: 'DSA + problem solving' },
            ],
          },
          {
            year: '2025',
            items: [
              { label: 'Full-stack development' },
              { label: 'Built real-world applications' },
              { label: 'Hackathons' },
              { label: 'Started exploring backend systems' },
            ],
          },
          {
            year: '2026',
            items: [
              { label: 'Backend engineering' },
              { label: 'Distributed systems' },
              { label: 'Cloud & DevOps' },
              { label: 'AI-powered applications' },
              { label: 'Open-source contributions' },
            ],
          },
        ],
        currentState: [
          { label: 'BUILDING', percent: 100, bar: '████████████', color: 'emerald' },
          { label: 'LEARNING', percent: 83, bar: '██████████░░', color: 'sky' },
          { label: 'EXPLORING', percent: 67, bar: '████████░░░░', color: 'purple' },
        ],
      },
    },
  },


  skills: {
    headingCommand: 'ls -la /tech_stack/',

    categories: [
      {
        fileName: 'languages.sh',
        title: 'Languages',
        icon: 'code',
        color: 'emerald',
        items: 'JavaScript, TypeScript, Python, Java, C, C++, SQL',
      },

      {
        fileName: 'backend.service',
        title: 'Backend',
        icon: 'layers',
        color: 'sky',
        items:
          'Node.js, Express.js, FastAPI, REST APIs, Microservices, Authentication, RBAC',
      },

      {
        fileName: 'frontend.ui',
        title: 'Frontend',
        icon: 'layout',
        color: 'violet',
        items: 'React, Vite, Tailwind CSS, HTML, CSS',
      },

      {
        fileName: 'databases.sql',
        title: 'Databases',
        icon: 'database',
        color: 'amber',
        items: 'PostgreSQL, MySQL, MongoDB, SQLite, Redis',
      },

      {
        fileName: 'cloud.yml',
        title: 'Cloud & DevOps',
        icon: 'cloud',
        color: 'blue',
        items:
          'AWS EC2, AWS S3, Docker, Kubernetes, Helm, GitHub Actions, Prometheus, Grafana',
      },

      {
        fileName: 'distributed.proto',
        title: 'Distributed Systems',
        icon: 'network',
        color: 'fuchsia',
        items:
          'BullMQ, Redis, Event-Driven Architecture, Queues, Concurrency, Distributed Locks, Resource Limiting, Microservices',
        isHighlighted: true,
      },

      {
        fileName: 'developer.tools',
        title: 'Developer Tools',
        icon: 'terminal',
        color: 'orange',
        items:
          'Git, GitHub, Linux, Prisma ORM, Postman, VS Code, PM2, Docker Compose',
      },

      {
        fileName: 'system-design.conf',
        title: 'System Design',
        icon: 'system',
        color: 'emerald',
        items:
          'HLD, LLD, API Design, Scalability, Caching, Load Balancing, Queues, Database Design, Distributed Systems',
        isHighlighted: true,
      },

      {
        fileName: 'ai-stack.conf',
        title: 'AI / Machine Learning',
        icon: 'brain',
        color: 'rose',
        items:
          'Machine Learning, Deep Learning, Generative AI, RAG, Embeddings, Vector Search, LLM Applications, Model APIs',
      },

      {
        fileName: 'cs-fundamentals.txt',
        title: 'Core CS',
        icon: 'book',
        color: 'teal',
        items:
          'Data Structures & Algorithms, OOP, DBMS, Operating Systems, Computer Networks, System Design',
      },
    ],
  },

  experience: {
    headingCommand: 'journalctl --unit=work-experience',

    logFile: 'experience.log',

    role: 'Web Developer',
    company: 'Students Special Group',
    period: 'Feb 2025 - Dec 2025',

    bullets: [
      'Developed backend services using Node.js and MySQL to support core academic platform functionalities.',
      'Designed normalized relational database schemas to improve data integrity, scalability, and maintainability.',
      'Designed and implemented RESTful APIs for user management, authentication, and academic workflows.',
      'Collaborated with cross-functional teams to translate functional requirements into scalable backend solutions.',
      'Mentored 50+ students in JavaScript, backend development, and software engineering best practices.',
    ],
  },

  projects: {
    headingCommand: 'docker ps --filter status=running',

    list: [
      {
        fileName: 'humming-tone',
        title: 'Humming Tone',
        period: '2026',
        icon: 'shopping-cart',
        color: 'emerald',

        bullets: [
          'Developed a production-ready e-commerce platform for a freelance client with secure authentication, RBAC, and an admin management dashboard.',
          'Integrated secure payment processing and automated order management workflows.',
          'Designed scalable backend architecture using Redis caching, modular services, and optimized database queries.',
          'Implemented product, inventory, order, coupon, and user management with role-based access control.',
        ],

        techStack:
          'TypeScript, Node.js, Express.js, PostgreSQL, Redis, Docker, AWS',

        image: '/hummingtone.png',
        repoUrl: 'https://github.com/GowthamCD6/Humming-Tone',
        isHighlighted: true,
      },

      {
        fileName: 'db-backup-cli',
        title: 'DB Backup CLI',
        period: '2026',
        icon: 'database',
        color: 'sky',

        bullets: [
          'Built a cross-platform CLI utility supporting automated backup and restore operations for PostgreSQL, MySQL, MongoDB, and SQLite.',
          'Implemented automated scheduling, compression, checksum verification, AWS S3 integration, and backup metadata management.',
          'Designed modular storage providers supporting both local and cloud backup destinations.',
          'Implemented Redis-backed job queues, worker concurrency, resource limiting, distributed locking, and scheduler execution guards.',
          'Integrated GitHub Actions, Dependabot, CodeQL, logging, automated testing, and production-oriented development workflows.',
        ],

        techStack:
          'TypeScript, Node.js, PostgreSQL, MySQL, MongoDB, SQLite, Redis, BullMQ, AWS S3, Docker',

        image: '/dbbackupcli.png',
        repoUrl: 'https://github.com/rithishcodespace/db-backup-cli',
        isHighlighted: true,
      },

      {
        fileName: 'plantera',
        title: 'Plantera',
        period: '2025',
        icon: 'leaf',
        color: 'fuchsia',

        bullets: [
          'Developed a real-time environmental monitoring platform for deforestation detection using satellite imagery and machine learning.',
          'Built an interactive dashboard featuring geographic visualization, trend analytics, and deforestation hotspot mapping.',
          'Integrated a React frontend with Node.js backend APIs and Python-based machine learning models.',
          'Implemented responsive visualization using Mapbox, Tailwind CSS, and data-driven UI components.',
        ],

        techStack:
          'React, Node.js, Express.js, Python, Mapbox, Tailwind CSS, Machine Learning',

        image: '/plantera.png',
        repoUrl: 'https://github.com/The-Plantera/Plantera-Web',
        isHighlighted: false,
      },

      {
        fileName: 'patentiq',
        title: 'PatentIQ',
        period: '2026',
        icon: 'search',
        color: 'amber',

        bullets: [
          'Built an AI-powered patent prior-art search platform to help innovators discover relevant existing patents and assess the novelty of their ideas.',
          'Designed a semantic search pipeline that converts patent documents and queries into embeddings and retrieves relevant prior-art using vector similarity.',
          'Developed an evidence analysis workflow that connects retrieved patents with supporting claims, technical similarities, and relevant prior-art evidence.',
          'Designed the system to improve patent research efficiency by combining semantic retrieval, document processing, and AI-assisted analysis.'
        ],

        techStack:
          'React, Node.js, Python, FastAPI, PostgreSQL, Vector Database, Embeddings, LLMs',

        image: '/patentiq.png',
        repoUrl: 'https://github.com/rithishcodespace/PatentIQ',
        isHighlighted: false,
      },

      {
        fileName: 'devtinder',
        title: 'DevTinder',
        period: '2025',
        icon: 'users',
        color: 'amber',

        bullets: [
          'Built a developer networking platform that enables developers to discover profiles, send connection requests, and build professional connections.',
          'Implemented secure authentication and authorization with JWT, along with protected routes and user session management.',
          'Developed REST APIs for user profiles, connection requests, authentication, and relationship management.',
          'Designed a responsive React interface with reusable components and integrated frontend state management with the backend APIs.'
        ],

        techStack:
          'React, Node.js, Express.js, MongoDB, JWT, REST APIs, Tailwind CSS',

        image: '/devtinder.png',
        repoUrl: 'https://github.com/rithishcodespace/DevTinder.git',
        isHighlighted: false,
      },

      {
        fileName: 'netflixgpt',
        title: 'NetflixGPT',
        period: '2025',
        icon: 'tv',
        color: 'amber',

        bullets: [
          'Built a Netflix-inspired streaming interface with authentication, movie browsing, categories, trailers, and responsive content sections.',
          'Integrated TMDB APIs to fetch movie metadata, posters, trailers, and categorized content dynamically.',
          'Implemented an AI-powered movie recommendation feature using GPT to generate personalized movie suggestions from natural-language queries.',
          'Optimized the application with reusable React components, Redux-based state management, and responsive UI patterns.'
        ],

        techStack:
          'React, JavaScript, Redux Toolkit, Tailwind CSS, TMDB API, OpenAI API, Firebase',

        image: '/netflixgpt.png',
        repoUrl: '#',
        isHighlighted: false,
      },
    ],
  },

  achievements: {
    headingCommand: 'cat /var/log/achievements.log',

    list: [
      {
        fileName: 'leetcode_metrics.log',
        step: '01',
        icon: 'code',
        value: '1000+',
        label: 'DSA problems solved on LeetCode',
        tag: 'PROBLEM SOLVING MILESTONE',
        category: 'ALGORITHMS & DATA STRUCTURES',
        badge: 'LEETCODE PROFILE',
        color: 'emerald',
        details: 'Optimized time & space complexities across arrays, trees, graphs, dynamic programming, and system design algorithms.',
        image: '/leetcode.png',
        url: 'https://leetcode.com/u/rithishcodespace',
      },

      {
        fileName: 'ieee_devspark_result.conf',
        step: '02',
        icon: 'award',
        value: '1st PLACE',
        label: 'Place at IEEE DevSpark Hackathon',
        tag: 'COMPETITION / TROPHY',
        category: 'NATIONAL HACKATHON CHAMPION',
        badge: 'RECOGNIZED',
        color: 'amber',
        details: 'Awarded 1st place with ₹10,000 cash prize in the National Level Hackathon organized by IEEE.',
        image: '/ieee_devspark.png',
      },

      {
        fileName: 'bit_hackathon_award.log',
        step: '03',
        icon: 'trophy',
        value: '1st PLACE',
        label: 'Place at BIT Hackathon',
        tag: 'HACKATHON RESULT',
        category: 'INSTITUTE ENGINEERING SPRINT',
        badge: 'CHAMPION',
        color: 'sky',
        details: 'Awarded 1st place with ₹3,000 cash prize at the BIT Hackathon for building an intuitive prototype with real-time features.',
        image: '/bit_hackathon.png',
      },

      {
        fileName: 'sns_ideathon_runnerup.json',
        step: '04',
        icon: 'medal',
        value: 'RUNNER-UP',
        label: 'SNS Ideathon',
        tag: 'TECHNICAL ACCOMPLISHMENT',
        category: 'PRODUCT INNOVATION SHOWCASE',
        badge: 'HONORABLE MENTION',
        color: 'rose',
        details: 'Awarded ₹10,000 cash prize along with official tech goodies for presenting innovative software solutions at the SNS Ideathon.',
        image: '/sns_ideathon.png',
      },

      {
        fileName: 'code_with_curious_first_place.json',
        step: '05',
        icon: 'trophy',
        value: '1ST PLACE',
        label: 'Code With Curious',
        tag: 'TECHNICAL ACHIEVEMENT',
        category: 'CODING COMPETITION',
        badge: 'WINNER',
        color: 'violet',
        details:
          'Secured 1st place in Code With Curious, a coding competition organized by the BIT Code Circle Club, demonstrating strong problem-solving and programming skills.',
        image: '/code_with_curious.png',
      },
    ],
  },

  education: {
    headingCommand: 'cat /etc/career_trajectory.conf',

    school: {
      step: '01',
      tag: 'FOUNDATION',
      name: 'SSM Lakshmi Ammal Matriculation Higher Secondary School',
      location: 'Komarapalayam, Tamil Nadu, India',
      metricLabel: '12th Percentage',
      metricValue: '91%',
      status: 'COMPLETED',
    },

    college: {
      step: '02',
      tag: 'CURRENT',
      name: 'Bannari Amman Institute of Technology',
      degree: 'B.E. Computer Science and Engineering',
      period: 'Aug 2024 — Present',
      metricLabel: 'CGPA',
      metricValue: '8.29 / 10',
      location: 'Sathyamangalam, Tamil Nadu, India',
      status: 'CURRENT',
    },

    career: {
      step: '03',
      tag: 'NEXT',
      title: 'CAREER / PLACEMENT',
      status: 'LOOKING FOR MY FIRST PRODUCTION BATTLE',
      objective: 'Build systems that survive contact with actual users.',
      targetPrimary: 'Software Engineering',
      targetSecondary: 'Backend Engineering',
      interests: [
        'Backend Systems',
        'Distributed Systems',
        'Cloud & DevOps',
        'Full-Stack Development',
      ],
      lookingForRole: 'Internships / Software Engineering Opportunities',
      lookingForBullets: [
        'Backend-heavy work',
        'Real engineering problems',
        'Strong engineering teams',
        'Opportunities to learn and contribute',
      ],
      gatePrep: {
        title: 'GATE / CSE',
        topics: ['DSA', 'OS', 'DBMS', 'Networks'],
      },
    },
  },

  contact: {
    headingCommand: 'ssh rithish@contact-server',

    fileName: 'contact-form.sh',

    email: 'rithishcodespace@gmail.com',
    phone: '+91 9952252304',
    location: 'Tamil Nadu, India',

    github: 'github.com/rithishcodespace',
    linkedin: 'linkedin.com/in/rithish-saravanan-32a39431a/',
    leetcode: 'leetcode.com/rithishcodespace',
  },
};