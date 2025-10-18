import { CareerPath, CareerPathName, TestQuestion, Adviser } from './types';

export const ADVISERS: Adviser[] = [
  { name: "Mr Maikudi", field: "Software Engineering & Web Development" },
  { name: "Mr Alfa", field: "Cybersecurity & Networking" },
  { name: "Mr Olayemi D.O", field: "AI & Data Science" },
  { name: "Mr Elmamud", field: "Cloud Computing & DevOps" }
];

export const CAREER_PATHS: CareerPath[] = [
  {
    name: CareerPathName.AI,
    description: "Artificial Intelligence and Data Science focus on creating intelligent systems that can learn, reason, and make decisions. It involves working with large datasets to extract insights and build predictive models.",
    skills: ["Machine Learning", "Deep Learning", "Python/R", "Data Visualization", "Statistics", "Natural Language Processing"],
    languages: ["Python", "R", "SQL", "Java", "C++"],
    advantages: ["High demand", "Cutting-edge technology", "High impact on various industries"],
    futureProspects: "AI is expected to grow exponentially, impacting everything from healthcare to autonomous vehicles. Data scientists are crucial for business intelligence.",
    salaryRangeNigeria: "₦250,000 - ₦1,000,000 / month",
    salaryRangeGlobal: "$120,000 - $250,000 / year"
  },
  {
    name: CareerPathName.CYBERSECURITY,
    description: "Cybersecurity professionals protect computer systems, networks, and data from theft, damage, or unauthorized access. It's a critical field for ensuring digital safety.",
    skills: ["Network Security", "Ethical Hacking", "Cryptography", "Risk Assessment", "Incident Response"],
    languages: ["Python", "Bash", "PowerShell", "SQL"],
    advantages: ["Extremely high demand", "Job security", "Critical importance in all sectors"],
    futureProspects: "With increasing cyber threats, the need for skilled cybersecurity experts will continue to rise. Specializations like cloud security and IoT security are growing fields.",
    salaryRangeNigeria: "₦200,000 - ₦800,000 / month",
    salaryRangeGlobal: "$100,000 - $200,000 / year"
  },
  {
    name: CareerPathName.NETWORKING,
    description: "Networking involves designing, building, and maintaining the communication networks that allow devices to connect and share information, from small office LANs to the global internet.",
    skills: ["Routing & Switching (Cisco/Juniper)", "Network Protocols (TCP/IP)", "Firewall Management", "Cloud Networking", "Network Troubleshooting"],
    languages: ["Python (for automation)", "Bash"],
    advantages: ["Foundation of all IT infrastructure", "Stable career path", "Opportunities for specialization"],
    futureProspects: "The shift to cloud computing and software-defined networking (SDN) is transforming the field, creating new opportunities for network engineers with automation skills.",
    salaryRangeNigeria: "₦180,000 - ₦600,000 / month",
    salaryRangeGlobal: "$90,000 - $160,000 / year"
  },
  {
    name: CareerPathName.WEB_DEV,
    description: "Web Development involves creating websites and web applications. It's divided into front-end (what the user sees), back-end (server-side logic), and full-stack (both).",
    skills: ["HTML/CSS/JavaScript", "React/Angular/Vue.js (Frontend)", "Node.js/Django/PHP (Backend)", "Databases (SQL/NoSQL)", "API Design"],
    languages: ["JavaScript", "TypeScript", "Python", "PHP", "HTML/CSS"],
    advantages: ["High demand for e-commerce and online services", "Visible and creative work", "Strong freelance opportunities"],
    futureProspects: "The field is constantly evolving with new frameworks and technologies like WebAssembly and Progressive Web Apps (PWAs), ensuring continuous learning and growth.",
    salaryRangeNigeria: "₦150,000 - ₦700,000 / month",
    salaryRangeGlobal: "$80,000 - $180,000 / year"
  },
  {
    name: CareerPathName.CLOUD,
    description: "Cloud Computing focuses on delivering computing services—including servers, storage, databases, networking, software, and analytics—over the Internet ('the cloud').",
    skills: ["AWS/Azure/GCP", "DevOps (CI/CD)", "Containerization (Docker, Kubernetes)", "Infrastructure as Code (Terraform)", "Cloud Security"],
    languages: ["Python", "Go", "YAML"],
    advantages: ["Massive industry growth", "Scalability and efficiency for businesses", "High paying roles"],
    futureProspects: "Nearly all businesses are moving to the cloud, making cloud skills essential. Serverless computing and hybrid cloud solutions are key future trends.",
    salaryRangeNigeria: "₦250,000 - ₦900,000 / month",
    salaryRangeGlobal: "$110,000 - $220,000 / year"
  },
  {
    name: CareerPathName.SOFTWARE_ENG,
    description: "Software Engineering is the systematic application of engineering principles to the design, development, testing, and maintenance of software.",
    skills: ["Data Structures & Algorithms", "Object-Oriented Design", "Software Development Life Cycle (SDLC)", "Version Control (Git)", "Debugging and Testing"],
    languages: ["Java", "C#", "Python", "JavaScript", "Go", "Rust"],
    advantages: ["Versatile skill set applicable to many areas", "Strong problem-solving focus", "Foundation for many other tech roles"],
    futureProspects: "Software is everywhere. Opportunities are vast, from mobile app development to embedded systems. Specializing in areas like distributed systems or performance engineering is lucrative.",
    salaryRangeNigeria: "₦200,000 - ₦850,000 / month",
    salaryRangeGlobal: "$100,000 - $200,000 / year"
  },
];

export const TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 'q1',
    question: "When faced with a complex problem, what is your first instinct?",
    options: [
      { text: "Break it down into smaller, logical steps and create a plan.", value: 4 }, // Software Eng
      { text: "Look for patterns and hidden connections in data.", value: 5 }, // AI
      { text: "Think about potential security risks and how to defend against them.", value: 3 }, // Cybersecurity
      { text: "Visualize the final product and how a user will interact with it.", value: 2 }, // Web Dev
    ],
  },
  {
    id: 'q2',
    question: "Which of these projects sounds most exciting to you?",
    options: [
      { text: "Designing a system that can predict stock market trends.", value: 5 }, // AI
      { text: "Building a beautiful, interactive website for a new brand.", value: 2 }, // Web Dev
      { text: "Setting up a secure and efficient computer network for a company.", value: 1 }, // Networking
      { text: "Developing a reliable, scalable mobile banking application.", value: 4 }, // Software Eng
    ],
  },
  {
    id: 'q3',
    question: "How do you prefer to work?",
    options: [
      { text: "In a structured environment, following a clear, agile plan.", value: 4 }, // Software Eng
      { text: "Experimenting with new ideas and iterating based on data.", value: 5 }, // AI
      { text: "Methodically, with high attention to detail and security protocols.", value: 3 }, // Cybersecurity
      { text: "Collaboratively, connecting different systems and services together.", value: 1 }, // Networking, Cloud
    ],
  },
  {
    id: 'q4',
    question: "What aspect of technology are you most curious about?",
    options: [
      { text: "How large systems like Netflix handle massive global traffic.", value: 1 }, // Cloud, Networking
      { text: "How to find and fix vulnerabilities before malicious hackers do.", value: 3 }, // Cybersecurity
      { text: "How to make computers think, see, and learn like humans.", value: 5 }, // AI
      { text: "How to create seamless and delightful user experiences on the web.", value: 2 }, // Web Dev
    ],
  },
  {
    id: 'q5',
    question: "When learning something new, you are most interested in:",
    options: [
      { text: "The underlying theory and abstract mathematical concepts.", value: 5 }, // AI
      { text: "The practical application and building something tangible.", value: 4 }, // Software Eng, Web Dev
      { text: "The big picture and how all the components fit together at scale.", value: 1 }, // Cloud, Networking
      { text: "The established best practices and security standards.", value: 3 }, // Cybersecurity
    ],
  },
  {
    id: 'q6',
    question: "What kind of tasks do you find most satisfying?",
    options: [
      { text: "Solving a complex logical puzzle or algorithm.", value: 4 }, // Software Eng
      { text: "Finding a critical flaw in a system's defense.", value: 3 }, // Cybersecurity
      { text: "Automating a repetitive process to make it more efficient.", value: 1 }, // Cloud, DevOps
      { text: "Cleaning and interpreting a large, messy dataset to find a story.", value: 5 }, // AI
    ],
  },
  {
    id: 'q7',
    question: "Which work environment appeals to you most?",
    options: [
      { text: "A fast-paced startup, building a new product from the ground up.", value: 2 }, // Web Dev
      { text: "A large tech company, working on scalable, mission-critical systems.", value: 4 }, // Software Eng, Cloud
      { text: "A government agency or financial institution focused on defense.", value: 3 }, // Cybersecurity
      { text: "A research lab, pushing the boundaries of what's possible.", value: 5 }, // AI
    ],
  },
  {
    id: 'q8',
    question: "How do you feel about routine and maintenance tasks?",
    options: [
      { text: "I enjoy them; ensuring a system is stable and secure is crucial.", value: 3 }, // Cybersecurity, Networking
      { text: "They are necessary, but I prefer to automate them away.", value: 1 }, // Cloud, DevOps
      { text: "I prefer focusing on building new features and functionalities.", value: 2 }, // Web Dev, Software Eng
      { text: "I'd rather be exploring new data and models.", value: 5 }, // AI
    ],
  },
  {
    id: 'q9',
    question: "When a system goes down, what's your immediate reaction?",
    options: [
      { text: "Trace the network path to see where the connection is failing.", value: 1 }, // Networking
      { text: "Check logs for unauthorized access or suspicious activity.", value: 3 }, // Cybersecurity
      { text: "Analyze the code and recent deployments to find the bug.", value: 4 }, // Software Eng
      { text: "Review the data pipeline for any corrupted inputs.", value: 5 }, // AI
    ],
  },
  {
    id: 'q10',
    question: "What is your long-term career goal?",
    options: [
      { text: "To design and architect large, resilient software systems.", value: 4 }, // Software Eng, Cloud
      { text: "To create beautiful and highly functional web applications.", value: 2 }, // Web Dev
      { text: "To become a leading expert in protecting digital assets.", value: 3 }, // Cybersecurity
      { text: "To build intelligent systems that solve major world problems.", value: 5 }, // AI
    ],
  },
];

export const QUICK_TEST_QUESTIONS: TestQuestion[] = [
  TEST_QUESTIONS[0], // Complex problem instinct
  TEST_QUESTIONS[1], // Exciting project
  TEST_QUESTIONS[3], // Technology curiosity
];