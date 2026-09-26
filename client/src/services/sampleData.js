// Benchmark academic literature and claims for seamless direct navbar navigation
export const BENCHMARK_PAPERS = [
  {
    _id: "bench_paper_1",
    title: "Emergent Abilities of Large Language Models",
    authors: ["Jason Wei", "Yi Tay", "Rishi Bommasani", "Colin Raffel", "Barret Zoph"],
    year: 2022,
    venue: "Transactions on Machine Learning Research",
    doi: "10.48550/arXiv.2206.07682",
    source: "OpenAlex",
    relevanceScore: 0.96,
    abstract: "Scaling up language models has been shown to predictably improve performance and sample efficiency on a wide range of downstream NLP tasks. This paper discusses emergent abilities in large language models—abilities that are not present in smaller models but are present in larger models."
  },
  {
    _id: "bench_paper_2",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones"],
    year: 2017,
    venue: "Advances in Neural Information Processing Systems (NeurIPS)",
    doi: "10.48550/arXiv.1706.03762",
    source: "OpenAlex",
    relevanceScore: 0.94,
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and relying entirely on an attention mechanism to draw global dependencies between input and output."
  },
  {
    _id: "bench_paper_3",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: ["Patrick Lewis", "Ethan Perez", "Aleksandra Piktus", "Fabio Petroni", "Vladimir Karpukhin"],
    year: 2020,
    venue: "Advances in Neural Information Processing Systems (NeurIPS)",
    doi: "10.48550/arXiv.2005.11401",
    source: "OpenAlex",
    relevanceScore: 0.91,
    abstract: "Large pre-trained language models store factual knowledge in their parameters, but their ability to access and manipulate knowledge is limited. We introduce RAG, a general-purpose fine-tuning recipe for retrieval-augmented generation models that combine parametric memory with non-parametric dense vector index."
  },
  {
    _id: "bench_paper_4",
    title: "A Survey on Hallucination in Large Language Models: Principles, Taxonomy, and Challenges",
    authors: ["Lei Huang", "Weijiang Yu", "Weitao Ma", "Weihang Su", "Chenghua Lin"],
    year: 2023,
    venue: "ACM Computing Surveys",
    doi: "10.1145/3638482",
    source: "OpenAlex",
    relevanceScore: 0.89,
    abstract: "The emergence of large language models has marked a significant milestone in artificial intelligence. However, LLMs suffer from generating nonsensical or unfaithful content, termed hallucination, which severely hampers real-world applications."
  },
  {
    _id: "bench_paper_5",
    title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    authors: ["Jason Wei", "Xuezhi Wang", "Dale Schuurmans", "Maarten Bosma", "Ed Chi"],
    year: 2022,
    venue: "Advances in Neural Information Processing Systems (NeurIPS)",
    doi: "10.48550/arXiv.2201.11903",
    source: "OpenAlex",
    relevanceScore: 0.88,
    abstract: "We explore how generating a chain of thought—a series of intermediate reasoning steps—significantly improves the ability of large language models to perform complex reasoning across multi-step arithmetic, commonsense, and symbolic tasks."
  }
];

export const BENCHMARK_CLAIMS = [
  {
    claim: "Scaling model parameters beyond 10B systematically induces emergent reasoning capabilities not observable in smaller architectures.",
    evidence: "Emergent abilities are not present in smaller models but are present in larger models; thus, they cannot be predicted simply by extrapolating the performance improvements of smaller models.",
    citationIds: ["bench_paper_1"]
  },
  {
    claim: "Retrieval-Augmented Generation (RAG) significantly mitigates hallucination by coupling parametric weights with dense vector retrieval indices.",
    evidence: "RAG models combine parametric memory with non-parametric dense vector index of Wikipedia, generating more specific, diverse, and factual language than parametric-only seq2seq models.",
    citationIds: ["bench_paper_3"]
  },
  {
    claim: "Self-attention mechanisms completely eliminate recurrence while drawing global contextual dependencies in constant operations.",
    evidence: "The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours.",
    citationIds: ["bench_paper_2"]
  },
  {
    claim: "Multi-step reasoning performance dramatically increases when intermediate chain-of-thought derivations are explicitly generated prior to final answers.",
    evidence: "Chain-of-thought prompting enables large language models to tackle complex reasoning problems that are not solvable with standard prompting methods alone.",
    citationIds: ["bench_paper_5"]
  }
];
