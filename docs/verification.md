# Neuro-Symbolic Verification Engine

The verification engine ensures that no scientific claim is hallucinated by the LLM without supporting evidence.

## Symbolic Component (Rules)
Explicit logical rules are executed against the generated claims:
1. **Rule 1 (Evidence Required)**: Every claim *must* have an array of citation IDs. If empty -> `INSUFFICIENT_EVIDENCE`.
2. **Rule 2 (Existential Check)**: Every citation ID must correspond to an actual document in the MongoDB instance. If missing -> `UNSUPPORTED`.
3. **Rule 3 (Metadata Consistency)**: Cross-checks metadata against the external academic source.

## Neural Component (Semantic)
Uses LLM evaluation to determine if the text of the cited abstract actually entails the claim.

## Output
The frontend displays evidence cards showing a clear breakdown of which rules passed or failed for every single claim generated during ideation.
