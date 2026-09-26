export const ACADEMIC_FIELDS = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    shortName: "CSE",
    description: "Computing, algorithms, architecture, software engineering, and AI.",
    icon: "💻"
  },
  {
    id: "ece",
    name: "Electronics & Communication Engineering",
    shortName: "ECE",
    description: "Semiconductors, telecommunications, embedded systems, and signals.",
    icon: "📡"
  },
  {
    id: "eee",
    name: "Electrical & Electronics Engineering",
    shortName: "EEE",
    description: "Power systems, control, circuits, and electrical networks.",
    icon: "⚡"
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    shortName: "MECH",
    description: "Thermodynamics, robotics, fluid mechanics, and materials.",
    icon: "⚙️"
  },
  {
    id: "civil",
    name: "Civil Engineering",
    shortName: "CIVIL",
    description: "Structural design, urban planning, materials, and infrastructure.",
    icon: "🏗️"
  }
];

export const SUBDOMAINS = {
  cse: [
    { id: "ai", name: "Artificial Intelligence", description: "Simulating human intelligence in machines." },
    { id: "ml", name: "Machine Learning", description: "Learning models and pattern recognition from data." },
    { id: "cv", name: "Computer Vision", description: "Visual understanding and perception for systems." },
    { id: "nlp", name: "Natural Language Processing", description: "Language understanding and text generation." },
    { id: "sec", name: "Cybersecurity", description: "Information security, cryptography, and defense." },
    { id: "ds", name: "Data Science", description: "Knowledge extraction from big data." },
    { id: "cloud", name: "Cloud Computing", description: "Distributed systems and scalable infrastructure." },
    { id: "hci", name: "Human-Computer Interaction", description: "Design of interactive computational systems." }
  ],
  ece: [
    { id: "dsp", name: "Digital Signal Processing", description: "Signal analysis and manipulation." },
    { id: "vlsi", name: "VLSI Design", description: "Very-large-scale integration circuits." },
    { id: "tele", name: "Telecommunications", description: "Wireless networks, 5G/6G, and RF engineering." }
  ],
  eee: [
    { id: "power", name: "Power Systems", description: "Generation, transmission, and distribution." },
    { id: "control", name: "Control Systems", description: "Automation and feedback systems." }
  ],
  mech: [
    { id: "thermo", name: "Thermodynamics", description: "Heat, work, and energy transfer." },
    { id: "robotics", name: "Robotics", description: "Kinematics, dynamics, and mechatronics." }
  ],
  civil: [
    { id: "struct", name: "Structural Engineering", description: "Design and analysis of structures." },
    { id: "enviro", name: "Environmental Engineering", description: "Sustainability and water management." }
  ]
};

export const TRENDING_AREAS = {
  ai: [
    { id: "genai", name: "Generative AI", description: "Models capable of generating text, images, code, audio, and other content.", trend: "High", papers: 1240 },
    { id: "xai", name: "Explainable AI", description: "Techniques to make AI model decisions interpretable and trustworthy.", trend: "High", papers: 950 },
    { id: "agents", name: "AI Agents", description: "Autonomous task-solving agents reasoning over long horizons.", trend: "Emerging", papers: 420 },
    { id: "multimodal", name: "Multimodal AI", description: "Systems that jointly reason across text, vision, and audio.", trend: "High", papers: 850 }
  ],
  ml: [
    { id: "rl", name: "Reinforcement Learning", description: "Decision-making models optimizing cumulative rewards.", trend: "Medium", papers: 3100 },
    { id: "fed", name: "Federated Learning", description: "Decentralized machine learning across edge devices.", trend: "High", papers: 1120 }
  ],
  cv: [
    { id: "3d", name: "3D Vision & NeRFs", description: "Neural rendering and 3D scene reconstruction.", trend: "High", papers: 780 }
  ],
  nlp: [
    { id: "llm", name: "Large Language Models", description: "Scaling laws, instruction tuning, and alignment of massive language models.", trend: "High", papers: 2450 },
    { id: "rag", name: "Retrieval-Augmented Generation", description: "Combining external knowledge bases with generation.", trend: "High", papers: 1300 }
  ]
};

// Extends BENCHMARK_PAPERS with Research Intelligence metadata
export const getPaperIntelligence = (paper) => {
  return {
    ...paper,
    coreDomains: ["Machine Learning", "Natural Language Processing", "Generative AI"],
    methods: ["Transformer Architecture", "Self-Attention", "Instruction Fine-Tuning"],
    datasets: ["CommonCrawl", "WikiText", "Human Feedback (RLHF)"],
    metrics: {
      "Accuracy": "N/A",
      "Perplexity": "12.4",
      "BLEU Score": "34.2",
      "Human Eval": "89.1%"
    },
    findings: [
      "Model demonstrates zero-shot generalization capabilities across unseen tasks.",
      "Scaling parameters logarithmically improves reasoning abilities.",
      "RLHF significantly reduces hallucinatory outputs compared to base models."
    ],
    limitations: [
      "Struggles with long-horizon logical reasoning tasks.",
      "Dataset bias affects multicultural representation.",
      "High computational overhead during inference."
    ],
    futureWork: [
      "Investigate sparse attention mechanisms for longer context windows.",
      "Explore non-autoregressive decoding for faster inference.",
      "Develop better factual grounding techniques."
    ],
    researchOpportunities: [
      {
        title: "Method Extension",
        description: "Improve the existing methodology by substituting standard dense attention with sparse/linear attention to handle 1M+ context lengths.",
        evidence: "The paper identifies 'High computational overhead during inference' as a core limitation due to quadratic attention complexity.",
        score: 4
      },
      {
        title: "Cross-Domain Application",
        description: "Apply the alignment techniques to specialized domains like clinical text or legal contracts.",
        evidence: "Evaluations were solely on general knowledge datasets; performance in domain-specific regimes remains unknown.",
        score: 3
      },
      {
        title: "Explainability / Robustness",
        description: "Investigate whether the model's intermediate representations contain interpretable factual states.",
        evidence: "Future work explicitly calls for 'better factual grounding techniques'.",
        score: 5
      }
    ],
    potentialScores: {
      "Method Extension": 4,
      "Dataset Opportunity": 2,
      "Application Expansion": 4,
      "Cross-Domain Potential": 5
    }
  };
};
