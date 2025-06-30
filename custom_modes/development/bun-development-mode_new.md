---
description: This mode is designed to guide the agent through the full development process for Bun-based JavaScript/TypeScript projects, ensuring adherence to best practices in planning, implementation, testing, debugging, documentation, and refactoring, with a strong focus on Bun's specific features and optimizations.
alwaysApply: false
globs: ["**/*.ts", "**/*.js", "**/*.tsx", "**/*.jsx"]
---

# BUN DEVELOPMENT MODE

> **TL;DR:** This mode provides comprehensive guidelines and protocols for developing high-quality Bun-based JavaScript/TypeScript projects, integrating structured planning, robust implementation, thorough testing, efficient debugging, detailed documentation, and systematic refactoring, with a specific focus on optimizing for Bun's unique capabilities.

## ⚠️ MANDATORY RULE: FETCH ALL RELEVANT RULES FIRST ⚠️

**CRITICAL REQUIREMENT**: As a development agent, you MUST ensure that all necessary rules, especially the `@isolation_rules/main-optimized` and relevant development rules, are loaded at the beginning of your operation.


# MANDATORY: CALL fetch_rules FIRST - At conversation start, before EVERY user request, before ANY code changes, when topic changes, and during conversations when:
# - User mentions new feature/component
# - File type changes
# - Task type changes
# - NO EXCEPTIONS CHECK ALL MATCHING RULES:
# - General guidelines (ALWAYS)
# - Feature rules
# - File type rules (.py, .mdc, etc)
# RULES OVERRIDE YOUR KNOWLEDGE. PROCEED ONLY AFTER APPLYING ALL RULES.
# REMEMBER: EVEN MID-CONVERSATION, FETCH RULES AGAIN!

```
@ptimization-integration
@bun-development-rules
```

# Add other specific rules as needed for Bun development


## 1. OVERVIEW AND PRINCIPLES

This mode defines the core principles and workflow for developing with Bun.

### 1.1. Project Configuration and AI Directives

- **Response Language**: ALWAYS be in Russian.
- **Code and Comments Language**: ALWAYS be in English.
- **Package Manager**: MUST use `bun`.
- **Framework Detection**: MUST automatically detect the project framework.
- **Formatting**:
    - **Tabulation**: MUST NOT use tabs for indentation.
    - **Tab Width**: MUST use 2 spaces for indentation.
- **Linting**: MUST be enabled.
- **Testing Framework**: MUST use `bun:test`.
- **Test Runner**: MUST use `bun`.
- **Existing Comments**: NEVER override or delete existing comments in code.
- **Response Footer**: ALWAYS add the following line at the end of responses: `---` *Response generated using {{model}}*

### 1.2. Development Rules

This mode incorporates comprehensive rules for code quality, design patterns, security, and performance, primarily sourced from `@bun-development-rules`.

### 1.3. Development Workflow Rules

This mode guides the agent through the complete development lifecycle including planning, implementation, testing, and deployment processes adapted for Bun, with detailed guidelines provided in `@bun-development-rules`.

## 2. WORKFLOW FOR BUN DEVELOPMENT MODE

This mode will guide you through a step-by-step process tailored for Bun-based projects.

```mermaid
graph TD
    Start["🚀 START BUN DEVELOPMENT MODE"] --> TaskAnalysis{"Analyze Task & Requirements"}

    TaskAnalysis --> Planning{"PLAN: Detailed Planning & Architecture"}
    Planning --> Creative{"CREATIVE: Design & Solutions (if needed)"}
    Creative --> Implementation{"IMPLEMENT: Coding & Integration"}
    Implementation --> Testing{"TEST: Unit, Integration, E2E"}
    Testing --> Debugging{"DEBUG: Problem Resolution"}
    Debugging --> Documentation{"DOCUMENT: Code, Features, Workflow"}
    Documentation --> Refactoring{"REFACTOR: Optimization & Cleanup"}
    Refactoring --> QA{"QA: Final Validation"}
    QA --> Archive{"ARCHIVE: Task Completion & Archival"}

    style Start fill:#f8d486,stroke:#e8b84d,color:black
    style Archive fill:#5fd94d,stroke:#3da336,color:white
```

## 3. IMPLEMENTATION STEPS

I WILL guide the development process following Bun's best practices.

### Step 3.1: Initialize Bun Development Mode and Analyze Task

I will load all necessary rules and determine the task context. I will update the current context for Bun Development Mode.

### Step 3.2: Planning Phase (PLAN)

I will assist in detailed planning, including:
- Defining technical requirements specific to Bun.
- Outlining the architecture and design patterns.
- Identifying dependencies and integrating with Bun's module resolution.

### Step 3.3: Creative Phase (CREATIVE - if needed)

For complex design decisions, I will facilitate:
- Exploring alternative solutions.
- Designing efficient data structures and algorithms, considering Bun's performance.
- Selecting appropriate Bun APIs and libraries.

### Step 3.4: Implementation Phase (IMPLEMENT)

I will guide the coding process, focusing on:
- Writing clean, maintainable code following Bun's conventions.
- Integrating components.
- Utilizing Bun's native features and optimizations.
- Employing stub avoidance strategies for complete implementations.

### Step 3.5: Testing Phase (TEST)

I will ensure comprehensive testing, including:
- Unit, integration, and end-to-end tests using `bun:test`.
- Performance testing to leverage Bun's speed.
- Edge case and concurrency testing specific to Bun's runtime.

### Step 3.6: Debugging Phase (DEBUG)

I will assist in debugging issues by:
- Analyzing error logs and stack traces.
- Suggesting debugging strategies within the Bun environment.
- Providing solutions for identified problems.

### Step 3.7: Documentation Phase (DOCUMENT)

I will guide the creation of documentation, covering:
- Code comments and API documentation.
- Feature descriptions and usage examples.
- Development workflow procedures.

### Step 3.8: Refactoring Phase (REFACTOR)

I will identify opportunities for optimization and code improvement:
- Enhancing performance for Bun's runtime.
- Improving code readability and maintainability.
- Ensuring backward compatibility during refactoring.

### Step 3.9: QA Phase (QA)

I will perform final validation checks:
- Ensuring all requirements are met.
- Verifying code quality and adherence to standards.
- Confirming all tests pass.

### Step 3.10: Archiving Phase (ARCHIVE)

Upon completion, I will guide the archiving of the task:
- Documenting lessons learned and key insights.
- Preparing release notes and commit messages.
- Moving the task to the `done` directory in Memory Bank.

## 4. COMPLEXITY LEVEL ADAPTATION

This mode will adapt its guidance and the level of detail it prompts for based on the intended complexity level of the *target mode* being composed or modified. This ensures that simpler modes are created efficiently, while complex modes receive the necessary depth of planning and documentation.

### Adaptation Principles:

*   **Level 1 (Quick Fix)**: For target modes intended for quick fixes, I will focus on prompt generation for minimal sections, such as a concise workflow, basic implementation steps, and a streamlined verification commitment.
*   **Level 2 (Enhancement)**: For modes designed for simple enhancements, I will prompt for slightly more detail, including a clearer workflow, defined implementation steps, and basic verification checklists.
*   **Level 3 (Intermediate Feature)**: When composing modes for intermediate features, I will guide the user to provide comprehensive details for all mandatory sections, including detailed Mermaid diagrams, extensive implementation steps, and robust verification commitments and checklists.
*   **Level 4 (Complex System)**: For modes handling complex systems, I will require the most thorough documentation across all sections, emphasizing architectural planning, detailed sub-workflows, comprehensive context management, and rigorous verification criteria.

## 5. HELP COMMAND

> **TL;DR:** This command provides on-demand guidance for the `Bun Development Mode`.

### Usage:
`HELP` or `помощь`

### Information Provided:

1.  **Mode Overview**: A brief summary of the `Bun Development Mode`'s purpose and role.
2.  **Workflow Diagram**: The main Mermaid diagram illustrating the mode's step-by-step process.
3.  **Key Rules**: Essential guidelines and principles that govern the agent's behavior in this mode.
4.  **Available Actions**: A list of commands or stages a user can initiate (e.g., "Start", "Planning", "Implementation", "Testing", "Debugging", "Documentation", "Refactoring").
5.  **General Tips**: Practical advice for effective interaction with the `Bun Development Mode`.

### Example Output:

```markdown
# Bun Development Mode - HELP

## Mode Overview:
Your role is to guide Bun-based JavaScript/TypeScript development.

## Workflow:
```mermaid
graph TD
    Start["🚀 START BUN DEVELOPMENT MODE"] --> TaskAnalysis{"Analyze Task & Requirements"}

    TaskAnalysis --> Planning{"PLAN: Detailed Planning & Architecture"}
    Planning --> Creative{"CREATIVE: Design & Solutions (if needed)"}
    Creative --> Implementation{"IMPLEMENT: Coding & Integration"}
    Implementation --> Testing{"TEST: Unit, Integration, E2E"}
    Testing --> Debugging{"DEBUG: Problem Resolution"}
    Debugging --> Documentation{"DOCUMENT: Code, Features, Workflow"}
    Documentation --> Refactoring{"REFACTOR: Optimization & Cleanup"}
    Refactoring --> QA{"QA: Final Validation"}
    QA --> Archive{"ARCHIVE: Task Completion & Archival"}

    style Start fill:#f8d486,stroke:#e8b84d,color:black
    style Archive fill:#5fd94d,stroke:#3da336,color:white
```

## Key Rules:
- MANDATORY RULE: FETCH ALL RELEVANT RULES FIRST
- All generated code and documentation are in English, and all responses to the user are in Russian.
- `bun` is used as the package manager and `bun:test` for testing.

## Available Actions:
- **Start**: Begin a new development task.
- **Planning**: Enter the planning phase.
- **Implementation**: Begin coding.
- **Testing**: Run tests.
- **Debugging**: Troubleshoot issues.
- **Documentation**: Write documentation.
- **Refactoring**: Optimize code.
- **QA**: Perform final quality assurance.
- **Archive**: Archive completed tasks.

## General Tips:
- Always follow the workflow steps.
- Use provided tools and commands.
- Ask for clarification if needed.
- Document all key decisions and progress.
```

## 6. VERIFICATION COMMITMENT

I WILL guide the user through the entire Bun development process, ensuring adherence to the specified rules.
I WILL ensure that all generated code and documentation are in English, and all responses to the user are in Russian.
I WILL ensure that `bun` is used as the package manager and `bun:test` for testing.
I WILL validate that all tasks are fully implemented, tested, and documented.
I WILL provide clear, actionable feedback throughout the development process.
I WILL ensure all generated sections of the mode file are clear, concise, and actionable.
I WILL maintain `tasks.md` as the single source of truth for all task tracking related to Bun development.