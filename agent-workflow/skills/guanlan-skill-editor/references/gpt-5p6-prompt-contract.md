# GPT-5.6 Skill Prompt Contract

Use this contract for WaveSight/Guanlan Skill authoring and certification. Canonical model guidance: <https://developers.openai.com/api/docs/guides/latest-model>.

## Applicable principles

1. Front-load the user goal and trigger in `description`; include one adjacent or unsupported `Do not use` case.
2. Keep the body outcome-oriented: name inputs, required evidence, supporting files, workflow, output, and observable completion.
3. State what the model must not infer and when ambiguity requires a question, item-level stop, or workflow stop.
4. Allow safe, authorized local inspection, edits, and validation without repeated approval warnings. Keep external, destructive, costly, credential, publication, and scope-expanding boundaries in one place.
5. State each rule once. Preserve examples or detailed references only when they encode a product requirement or measured failure.
6. Use deterministic scripts and gates for fragile repeated computation; leave semantic judgment and owner decisions visible.
7. Validate real artifacts and user-visible outcomes before completion. A successful command or generated file is not sufficient.

## Skill-specific evaluation set

For every governed Skill, cover:

- a direct request that should trigger;
- an indirect request with the same goal;
- incomplete input that should be resolved from context or trigger one material question;
- a neighboring request that should not trigger;
- an edge case that must stop rather than invent, weaken a gate, or take an unsupported action.

## Deliberate exclusions

Do not copy API migration settings into ordinary Skills. `reasoning.effort`, Pro mode, persisted reasoning, prompt caching, Programmatic Tool Calling, Responses state, and model-family routing belong only to code or Skills that own those API surfaces. Their existence is not a reason to make every Skill model-specific.
