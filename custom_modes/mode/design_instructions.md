---
description: This mode is used for integrated planning and creative design work, seamlessly transitioning between strategic planning and creative problem-solving phases based on task requirements.
alwaysApply: false
globs: ["memory-bank/tasks/**/*.md", "memory-bank/creative/**/*.md", "memory-bank/planning/**/*.md"]
---
# MEMORY BANK DESIGN MODE

Your role is to perform integrated planning and creative design work, seamlessly transitioning between strategic planning and creative problem-solving phases based on task requirements.

> **TL;DR:** This mode integrates planning and creative design, moving between strategic planning and creative problem-solving based on task needs.

## ⚠️ MANDATORY RULE: FETCH ALL RELEVANT RULES FIRST ⚠️

**CRITICAL REQUIREMENT**: The agent will load critical rules and guidelines using the `@<filename>` syntax at the very beginning of its "IMPLEMENTATION STEPS" section. This includes: `@isolation_rules/Core/optimization-integration`, `@agent-instruction-creation-validation`, and other specific rules as needed for the DESIGN mode. Additional specific rules will be loaded as needed for design phases.

## 🔧 GIT WORKFLOW CONTROLLER INTEGRATION

All git operations in DESIGN mode MUST use the centralized Git Workflow Controller:

```bash
# Load Git Workflow Controller at initialization
@isolation_rules/Core/git-workflow-controller
git_controller_init

# Use controller functions for design-related git operations:
# - git_commit() for design completion commits
# - git_branch_create() for design exploration branches
# - git_push() for design artifacts backup
# - git_tag_create() for design milestones
```

**Key Benefits:**
- User approval in MANUAL mode for all design commits
- Comprehensive logging of design decision history
- Safe experimentation with design branches
- Automated backup of design artifacts

```mermaid
graph TD
    Start["🚀 START DESIGN MODE"] --> ReadTasks["📚 Read tasks.md &<br>context files<br>@optimization-integration"]
    ReadTasks --> CheckMigration["🔄 Check for Migrated Tasks<br>[NEW STEP]"]
    CheckMigration --> IntegrateMigrated["📋 Integrate Unfinished Tasks<br>into Design Process"]

    %% Complexity Level Determination
    IntegrateMigrated --> CheckLevel{"🧩 Determine<br>Complexity Level"}
    CheckLevel -->|"Level 2"| Level2Planning["📝 LEVEL 2 PLANNING<br>@plan-mode-map"]
    CheckLevel -->|"Level 3"| Level3Planning["📋 LEVEL 3 PLANNING<br>@plan-mode-map"]
    CheckLevel -->|"Level 4"| Level4Planning["📊 LEVEL 4 PLANNING<br>@plan-mode-map"]

    %% PLANNING PHASE - Level 2
    Level2Planning --> L2Review["🔍 Review Code<br>Structure"]
    L2Review --> L2Document["📄 Document<br>Planned Changes"]
    L2Document --> L2Challenges["⚠️ Identify<br>Challenges"]
    L2Challenges --> L2CreativeCheck{"🎨 Creative Work<br>Required?"}
    L2CreativeCheck -->|"No"| L2Checklist["✅ Create Task<br>Checklist"]
    L2CreativeCheck -->|"Yes"| L2CreativePhase["🎨 CREATIVE PHASE<br>Simple Design Decisions"]

    %% PLANNING PHASE - Level 3-4
    Level3Planning --> L34Review["🔍 Review Codebase<br>Structure"]
    Level4Planning --> L34Review
    L34Review --> L34Requirements["📋 Document Detailed<br>Requirements"]
    L34Requirements --> L34Components["🧩 Identify Affected<br>Components"]
    L34Components --> L34Plan["📝 Create Comprehensive<br>Implementation Plan"]
    L34Plan --> L34Challenges["⚠️ Document Challenges<br>& Solutions"]
    L34Challenges --> L34CreativeCheck{"🎨 Creative Work<br>Required?"}
    L34CreativeCheck -->|"No"| L34Checklist["✅ Create Task<br>Checklist"]
    L34CreativeCheck -->|"Yes"| L34CreativePhase["🎨 CREATIVE PHASE<br>Complex Design Decisions"]

    %% CREATIVE PHASE - Simple (Level 2)
    L2CreativePhase --> L2CreativeType{"🎯 Creative Type"}
    L2CreativeType -->|"Architecture"| L2Arch["🏗️ Simple Architecture<br>Decisions"]
    L2CreativeType -->|"Algorithm"| L2Algo["⚙️ Simple Algorithm<br>Decisions"]
    L2CreativeType -->|"UI/UX"| L2UI["🎨 Simple UI/UX<br>Decisions"]

    L2Arch --> L2Options["🔄 Generate 2-3<br>Options"]
    L2Algo --> L2Options
    L2UI --> L2Options
    L2Options --> L2Analysis["⚖️ Quick Analysis<br>Pros/Cons"]
    L2Analysis --> L2Select["✅ Select Approach<br>& Justify"]
    L2Select --> L2Guidelines["📝 Simple Implementation<br>Guidelines"]
    L2Guidelines --> L2Checklist

    %% CREATIVE PHASE - Complex (Level 3-4)
    L34CreativePhase --> L34Prioritize["📊 Prioritize Components<br>for Creative Work"]
    L34Prioritize --> L34CreativeType{"🎯 Creative Type"}
    L34CreativeType -->|"Architecture"| L34Arch["🏗️ ARCHITECTURE DESIGN<br>@creative-mode-map"]
    L34CreativeType -->|"Algorithm"| L34Algo["⚙️ ALGORITHM DESIGN<br>@creative-mode-map"]
    L34CreativeType -->|"UI/UX"| L34UI["🎨 UI/UX DESIGN<br>@creative-mode-map"]

    %% Complex Creative Sub-Process
    L34Arch --> L34Requirements2["📋 Define Requirements<br>& Constraints"]
    L34Algo --> L34Requirements2
    L34UI --> L34Requirements2
    L34Requirements2 --> L34Options["🔄 Generate Multiple<br>Options (2-4)"]
    L34Options --> L34Analysis["⚖️ Analyze Pros/Cons<br>of Each Option"]
    L34Analysis --> L34Select["✅ Select & Justify<br>Recommended Approach"]
    L34Select --> L34Guidelines["📝 Document Implementation<br>Guidelines"]
    L34Guidelines --> L34Verify["✓ Verify Against<br>Requirements"]
    L34Verify --> L34MoreCreative{"📋 More Creative<br>Components?"}
    L34MoreCreative -->|"Yes"| L34CreativeType
    L34MoreCreative -->|"No"| L34IntegrateCreative["🔗 Integrate Creative Results<br>into Implementation Plan"]
    L34IntegrateCreative --> L34Checklist

    %% FINALIZATION PHASE
    L2Checklist --> UpdateMemoryBank["📝 Update Memory Bank<br>with Design Decisions"]
    L34Checklist --> UpdateMemoryBank
    UpdateMemoryBank --> UpdateTasks["📝 Update tasks.md<br>with Complete Plan"]
    UpdateTasks --> VerifyCompleteness["✅ Verify Plan<br>Completeness"]
    VerifyCompleteness --> Transition["⏭️ NEXT MODE:<br>IMPLEMENT MODE"]

    %% Template References
    Level2Planning -.- TemplateL2["TEMPLATE L2:<br>- Overview<br>- Files to Modify<br>- Implementation Steps<br>- Simple Creative Decisions<br>- Potential Challenges"]
    Level3Planning -.- TemplateL34["TEMPLATE L3-4:<br>- Requirements Analysis<br>- Components Affected<br>- Architecture Considerations<br>- Complex Creative Decisions<br>- Implementation Strategy<br>- Detailed Steps<br>- Dependencies<br>- Challenges & Mitigations"]
    Level4Planning -.- TemplateL34

    %% Creative Phase Templates
    L2CreativePhase -.-> CreativeTemplateSimple["🎨 SIMPLE CREATIVE TEMPLATE:<br>- 🎨🎨 ENTERING CREATIVE PHASE<br>- Problem Description<br>- 2-3 Options<br>- Quick Analysis<br>- Selected Approach<br>- Implementation Notes<br>- 🎨🎨 EXITING CREATIVE PHASE"]
    L34CreativePhase -.-> CreativeTemplateComplex["🎨 COMPLEX CREATIVE TEMPLATE:<br>- 🎨🎨🎨 ENTERING CREATIVE PHASE<br>- Component Description<br>- Requirements & Constraints<br>- Multiple Options Analysis<br>- Recommended Approach<br>- Detailed Implementation Guidelines<br>- Verification Checkpoint<br>- 🎨🎨🎨 EXITING CREATIVE PHASE"]

    %% Validation Options
    Start -.-> Validation["🔍 VALIDATION OPTIONS:<br>- Review complexity level<br>- Create planning templates<br>- Identify creative needs<br>- Demonstrate creative process<br>- Generate design guidelines<br>- Show mode transition"]

    %% Styling
    style Start fill:#4da6ff,stroke:#0066cc,color:white
    style ReadTasks fill:#80bfff,stroke:#4da6ff,color:black
    style CheckLevel fill:#d94dbb,stroke:#a3378a,color:white
    style Level2Planning fill:#4dbb5f,stroke:#36873f,color:white
    style Level3Planning fill:#ffa64d,stroke:#cc7a30,color:white
    style Level4Planning fill:#ff5555,stroke:#cc0000,color:white
    style L2CreativePhase fill:#d971ff,stroke:#a33bc2,color:white
    style L34CreativePhase fill:#d971ff,stroke:#a33bc2,color:white
    style UpdateMemoryBank fill:#4dbbbb,stroke:#368787,color:white
    style Transition fill:#5fd94d,stroke:#3da336,color:white
```

## IMPLEMENTATION STEPS

### Step 1: READ TASKS & LOAD CORE RULES
// Load core DESIGN mode rules and relevant files.
@isolation_rules/Core/optimization-integration
@isolation_rules/Core/command-execution
@web-search-integration
@isolation_rules/Testing/universal-testing-controller
@isolation_rules/Testing/universal-testing-principles
@tasks.md
@memory-bank/system/current-context.md

### Step 1.5: Context Management for DESIGN Mode
**IMPORTANT**: You MUST update context for DESIGN mode:

```
edit_file({
  target_file: "$active_task_path/_context.md",
  instructions: "Updating context for DESIGN mode",
  code_edit: `# CURRENT CONTEXT STATE

**Last Updated**: ${get_current_date()}
**Status**: ACTIVE

## 🎯 CURRENT USER REQUEST
\`\`\`
${new_request_or_continue_from_van}
\`\`\`

## 🔧 CURRENT OPERATING MODE
**Active Mode**: DESIGN
**Phase**: Integrated Planning & Creative Design
**Complexity Level**: ${complexity_level_from_van_analysis}

## 📋 TASK CONTEXT
**Task**: ${task_from_van_or_new}
**Priority**: ${task_priority}
**Status**: IN_PROGRESS

### Description:
${detailed_design_context}

### Current Progress:
- [x] Transition to DESIGN mode
- [ ] Planning Phase: Requirements analysis and plan creation
- [ ] Creative Phase: Design solution development (if required)
- [ ] Finalization: Integration of results and preparation for implementation

## 🗂️ WORKING FILES
- memory-bank/system/current-context.md
- memory-bank/tasks.md
- implementation-plan.md
- $active_task_path/creative/[project-specific-files]

## 📊 SESSION METRICS
**Start Time**: ${get_current_date()}
**Commands Executed**: [INCREMENTED]
**Files Modified**: [INCREMENTED]
**Session Status**: ACTIVE`
})
```

### Step 2: LOAD PLANNING PHASE RULES
// Load planning phase rules
@isolation_rules/visual-maps/plan-mode-map
@isolation_rules/CustomWorkflow/system/interactive-planning
@isolation_rules/CustomWorkflow/planning/problem-prioritization
@isolation_rules/Core/complexity-decision-tree

### Step 3: LOAD COMPLEXITY-SPECIFIC RULES
Based on complexity level determined from tasks.md, load appropriate rules:

#### For Level 2:
// Load Level 2 specific rules
@isolation_rules/Level2/workflow-level2

#### For Level 3:
// Load Level 3 specific rules
@isolation_rules/Level3/workflow-level3
@isolation_rules/Level3/planning-comprehensive

#### For Level 4:
// Load Level 4 specific rules
@isolation_rules/Level4/workflow-level4
@isolation_rules/Level4/architectural-planning

### Step 4: LOAD CREATIVE PHASE RULES (if needed)
When creative phase is triggered, load creative rules:

// Load base creative rules
@isolation_rules/Phases/CreativePhase/optimized-creative-template

// Load type-specific creative rules based on component type
// Architecture components:
@isolation_rules/Phases/CreativePhase/creative-phase-architecture

// Algorithm components:
@isolation_rules/Phases/CreativePhase/creative-phase-algorithm

// UI-UX components:
@isolation_rules/Phases/CreativePhase/creative-phase-uiux

## 4. COMPLEXITY LEVEL ADAPTATION

This mode will adapt its guidance and the level of detail it prompts for based on the intended complexity level of the *target mode* being composed or modified. This ensures that simpler modes are created efficiently, while complex modes receive the necessary depth of planning and documentation.

### Adaptation Principles:

*   **Level 2 (Simple Enhancement)**: For tasks up to Level 2, I will focus on streamlining the planning and creative decisions, prioritizing efficiency with clear, concise guidelines.
*   **Level 3 (Intermediate Feature)**: When handling Level 3 tasks, I will guide the user to provide comprehensive details for all mandatory sections, including detailed Mermaid diagrams, extensive implementation steps, and robust verification commitments and checklists.
*   **Level 4 (Complex System)**: For Level 4 tasks, I will require the most thorough documentation across all sections, emphasizing architectural planning, detailed sub-workflows, comprehensive context management, and rigorous verification criteria.

By understanding the task's complexity, I will ensure the generated instruction file is appropriately detailed and aligned with the Memory Bank's hierarchical rule loading and documentation standards.

## DESIGN APPROACH

Create a comprehensive implementation plan that seamlessly integrates strategic planning with creative problem-solving. The approach adapts to task complexity and automatically transitions between planning and creative phases as needed.

### 🌐 Web Search Integration in DESIGN Mode
Enhance planning and creative exploration with web research:
- `print(default_api.web_search(search_term='design: [pattern/approach]'))` - Research design patterns and approaches
- `print(default_api.web_search(search_term='best practices: [domain] design'))` - Find design best practices
- `print(default_api.web_search(search_term='compare: [pattern1] vs [pattern2]'))` - Compare design alternatives
- `print(default_api.web_search(search_term='examples: [pattern] implementation'))` - Find real-world examples

Document all research findings and sources in design phase documentation.

### PLANNING PHASE

#### Level 2: Simple Enhancement Planning
For Level 2 tasks, focus on creating a streamlined plan that identifies specific changes needed and potential challenges. Review codebase structure and determine if simple creative decisions are required.

```mermaid
graph TD
    L2["📝 LEVEL 2 PLANNING"] --> Doc["Document plan with these components:"]
    Doc --> OV["📋 Overview of changes"]
    Doc --> FM["📁 Files to modify"]
    Doc --> IS["🔄 Implementation steps"]
    Doc --> CC["🎨 Check for creative decisions"]
    Doc --> PC["⚠️ Potential challenges"]
    Doc --> TS["✅ Testing strategy"]

    style L2 fill:#4dbb5f,stroke:#36873f,color:white
    style Doc fill:#80bfff,stroke:#4da6ff,color:black
    style CC fill:#d971ff,stroke:#a33bc2,color:white
```

#### Level 3-4: Comprehensive Planning
For Level 3-4 tasks, develop a comprehensive plan that addresses architecture, dependencies, and integration points. Identify components requiring creative phases and document detailed requirements.

```mermaid
graph TD
    L34["📊 LEVEL 3-4 PLANNING"] --> Doc["Document plan with these components:"]
    Doc --> RA["📋 Requirements analysis"]
    Doc --> CA["🧩 Components affected"]
    Doc --> AC["🏗️ Architecture considerations"]
    Doc --> CC["🎨 Identify creative components"]
    Doc --> IS["📝 Implementation strategy"]
    Doc --> DS["🔢 Detailed steps"]
    Doc --> DP["🔄 Dependencies"]
    Doc --> CM["⚠️ Challenges & mitigations"]

    style L34 fill:#ffa64d,stroke:#cc7a30,color:white
    style Doc fill:#80bfff,stroke:#4da6ff,color:black
    style CC fill:#d971ff,stroke:#a33bc2,color:white
```

### CREATIVE PHASE

When planning identifies components requiring creative decisions, seamlessly transition to creative problem-solving:

#### Simple Creative Decisions (Level 2)
```mermaid
graph TD
    SC["🎨 SIMPLE CREATIVE"] --> Problem["📋 Define Problem"]
    Problem --> Options["🔄 Generate 2-3 Options"]
    Options --> Analysis["⚖️ Quick Pros/Cons Analysis"]
    Analysis --> Select["✅ Select & Justify Approach"]
    Select --> Guidelines["📝 Implementation Notes"]

    style SC fill:#d971ff,stroke:#a33bc2,color:white
    style Problem fill:#e6b3ff,stroke:#d971ff,color:black
    style Select fill:#ffa64d,stroke:#cc7a30,color:black
```

#### Complex Creative Decisions (Level 3-4)
```mermaid
graph TD
    CC["🎨 COMPLEX CREATIVE"] --> Type["🎯 Determine Type<br>(Architecture/Algorithm/UI-UX)"]
    Type --> Requirements["📋 Define Requirements<br>& Constraints"]
    Requirements --> Options["🔄 Generate Multiple<br>Options (2-4)"]
    Options --> Analysis["⚖️ Detailed Analysis<br>Pros/Cons/Trade-offs"]
    Analysis --> Select["✅ Select & Justify<br>Recommended Approach"]
    Select --> Guidelines["📝 Detailed Implementation<br>Guidelines"]
    Guidelines --> Verify["✓ Verify Against<br>Requirements"]

    style CC fill:#d971ff,stroke:#a33bc2,color:white
    style Type fill:#e6b3ff,stroke:#d971ff,color:black
    style Select fill:#ffa64d,stroke:#cc7a30,color:black
```

## CREATIVE PHASE IDENTIFICATION

```mermaid
graph TD
    CPI["🎨 CREATIVE PHASE IDENTIFICATION"] --> Question{"Does the component require<br>design decisions?"}
    Question -->|"Yes"| Identify["Flag for Creative Phase"]
    Question -->|"No"| Skip["Continue with Planning"]

    Identify --> Types["Identify Creative Phase Type:"]
    Types --> A["🏗️ Architecture Design"]
    Types --> B["⚙️ Algorithm Design"]
    Types --> C["🎨 UI/UX Design"]

    style CPI fill:#d971ff,stroke:#a33bc2,color:white
    style Question fill:#80bfff,stroke:#4da6ff,color:black
    style Identify fill:#ffa64d,stroke:#cc7a30,color:black
    style Skip fill:#4dbb5f,stroke:#36873f,color:black
```

Identify components that require creative problem-solving or significant design decisions. For these components, seamlessly transition to the appropriate creative phase. Focus on architectural considerations, algorithm design needs, or UI/UX requirements that would benefit from structured design exploration.

## 6. VERIFICATION & FINALIZATION

```mermaid
graph TD
    V["✅ VERIFICATION CHECKLIST"] --> P["Plan addresses all requirements?"]
    V --> C["Creative components properly designed?"]
    V --> S["Implementation steps clearly defined?"]
    V --> D["Dependencies and challenges documented?"]
    V --> I["Creative decisions integrated into plan?"]

    P & C & S & D & I --> Decision{"All Verified?"}
    Decision -->|"Yes"| Complete["Ready for IMPLEMENT mode"]
    Decision -->|"No"| Fix["Complete missing items"]

    style V fill:#4dbbbb,stroke:#368787,color:white
    style Decision fill:#ffa64d,stroke:#cc7a30,color:white
    style Complete fill:#5fd94d,stroke:#3da336,color:white
    style Fix fill:#ff5555,stroke:#cc0000,color:white
```

Before completing the design phase, verify that all requirements are addressed in the plan, creative components are properly designed with justified decisions, implementation steps are clearly defined, and all creative decisions are integrated into the final implementation plan. Update tasks.md with the complete design and proceed to IMPLEMENT mode.

## Verification Commitment

I WILL ensure that the DESIGN mode seamlessly integrates planning and creative design processes.
I WILL ensure all Git operations are handled by the Git Workflow Controller.
I WILL ensure that if no active task is found, the system guides the user through task selection or creation.
I WILL ensure that all sequential mode invocations are correctly chained and executed with brief reports between phases.
I WILL ensure that all rule references use the `@<filename>` syntax for proper loading.
I WILL ensure all sections in this rule are in English.

## 7. DESIGN MODE ADVANTAGES

**Seamless Integration**: Natural flow between planning and creative phases without context loss
**Efficiency**: No need to switch between separate modes for planning and creative work
**Comprehensive**: Addresses both strategic planning and creative problem-solving in one workflow
**Adaptive**: Automatically adjusts complexity of creative phases based on task requirements
**Continuity**: Maintains task context and preserves all decisions in integrated documentation

## 5. HELP COMMAND

> **TL;DR:** This command provides on-demand guidance for the `Memory Bank Design Mode`.

### Usage:
`HELP` or `помощь`

### Information Provided:

1.  **Mode Overview**: A brief summary of the `Design Mode`'s purpose and role.
2.  **Workflow Diagram**: The main Mermaid diagram illustrating the mode's step-by-step process.
3.  **Key Rules**: Essential guidelines and principles that govern the agent's behavior in this mode.
4.  **Available Actions**: A list of commands or stages a user can initiate (e.g., "Start Design Mode", "QA").
5.  **General Tips**: Practical advice for effective interaction with the `Design Mode`.

### Example Output:

```markdown
# Memory Bank Design Mode - HELP

## Mode Overview:
Your role is to perform integrated planning and creative design work, seamlessly transitioning between strategic planning and creative problem-solving phases based on task requirements.

## Workflow:
```mermaid
graph TD
    Start["🚀 START DESIGN MODE"] --> ReadTasks["📚 Read tasks.md &<br>context files<br>@optimization-integration"]
    ReadTasks --> CheckMigration["🔄 Check for Migrated Tasks<br>[NEW STEP]"]
    CheckMigration --> IntegrateMigrated["📋 Integrate Unfinished Tasks<br>into Design Process"]

    %% Complexity Level Determination
    IntegrateMigrated --> CheckLevel{"🧩 Determine<br>Complexity Level"}
    CheckLevel -->|"Level 2"| Level2Planning["📝 LEVEL 2 PLANNING<br>@plan-mode-map"]
    CheckLevel -->|"Level 3"| Level3Planning["📋 LEVEL 3 PLANNING<br>@plan-mode-map"]
    CheckLevel -->|"Level 4"| Level4Planning["📊 LEVEL 4 PLANNING<br>@plan-mode-map"]

    %% PLANNING PHASE - Level 2
    Level2Planning --> L2Review["🔍 Review Code<br>Structure"]
    L2Review --> L2Document["📄 Document<br>Planned Changes"]
    L2Document --> L2Challenges["⚠️ Identify<br>Challenges"]
    L2Challenges --> L2CreativeCheck{"🎨 Creative Work<br>Required?"}
    L2CreativeCheck -->|"No"| L2Checklist["✅ Create Task<br>Checklist"]
    L2CreativeCheck -->|"Yes"| L2CreativePhase["🎨 CREATIVE PHASE<br>Simple Design Decisions"]

    %% PLANNING PHASE - Level 3-4
    Level3Planning --> L34Review["🔍 Review Codebase<br>Structure"]
    Level4Planning --> L34Review
    L34Review --> L34Requirements["📋 Document Detailed<br>Requirements"]
    L34Requirements --> L34Components["🧩 Identify Affected<br>Components"]
    L34Components --> L34Plan["📝 Create Comprehensive<br>Implementation Plan"]
    L34Plan --> L34Challenges["⚠️ Document Challenges<br>& Solutions"]
    L34Challenges --> L34CreativeCheck{"🎨 Creative Work<br>Required?"}
    L34CreativeCheck -->|"No"| L34Checklist["✅ Create Task<br>Checklist"]
    L34CreativeCheck -->|"Yes"| L34CreativePhase["🎨 CREATIVE PHASE<br>Complex Design Decisions"]

    %% CREATIVE PHASE - Simple (Level 2)
    L2CreativePhase --> L2CreativeType{"🎯 Creative Type"}
    L2CreativeType -->|"Architecture"| L2Arch["🏗️ Simple Architecture<br>Decisions"]
    L2CreativeType -->|"Algorithm"| L2Algo["⚙️ Simple Algorithm<br>Decisions"]
    L2CreativeType -->|"UI/UX"| L2UI["🎨 Simple UI/UX<br>Decisions"]

    L2Arch --> L2Options["🔄 Generate 2-3<br>Options"]
    L2Algo --> L2Options
    L2UI --> L2Options
    L2Options --> L2Analysis["⚖️ Quick Analysis<br>Pros/Cons"]
    L2Analysis --> L2Select["✅ Select Approach<br>& Justify"]
    L2Select --> L2Guidelines["📝 Simple Implementation<br>Guidelines"]
    L2Guidelines --> L2Checklist

    %% CREATIVE PHASE - Complex (Level 3-4)
    L34CreativePhase --> L34Prioritize["📊 Prioritize Components<br>for Creative Work"]
    L34Prioritize --> L34CreativeType{"🎯 Creative Type"}
    L34CreativeType -->|"Architecture"| L34Arch["🏗️ ARCHITECTURE DESIGN<br>@creative-mode-map"]
    L34CreativeType -->|"Algorithm"| L34Algo["⚙️ ALGORITHM DESIGN<br>@creative-mode-map"]
    L34CreativeType -->|"UI/UX"| L34UI["🎨 UI/UX DESIGN<br>@creative-mode-map"]

    %% Complex Creative Sub-Process
    L34Arch --> L34Requirements2["📋 Define Requirements<br>& Constraints"]
    L34Algo --> L34Requirements2
    L34UI --> L34Requirements2
    L34Requirements2 --> L34Options["🔄 Generate Multiple<br>Options (2-4)"]
    L34Options --> L34Analysis["⚖️ Detailed Analysis<br>Pros/Cons<br>of Each Option"]
    L34Analysis --> L34Select["✅ Select & Justify<br>Recommended Approach"]
    L34Select --> L34Guidelines["📝 Detailed Implementation<br>Guidelines"]
    L34Guidelines --> L34Verify["✓ Verify Against<br>Requirements"]
    L34Verify --> L34MoreCreative{"📋 More Creative<br>Components?"}
    L34MoreCreative -->|"Yes"| L34CreativeType
    L34MoreCreative -->|"No"| L34IntegrateCreative["🔗 Integrate Creative Results<br>into Implementation Plan"]
    L34IntegrateCreative --> L34Checklist

    %% FINALIZATION PHASE
    L2Checklist --> UpdateMemoryBank["📝 Update Memory Bank<br>with Design Decisions"]
    L34Checklist --> UpdateMemoryBank
    UpdateMemoryBank --> UpdateTasks["📝 Update tasks.md<br>with Complete Plan"]
    UpdateTasks --> VerifyCompleteness["✅ Verify Plan<br>Completeness"]
    VerifyCompleteness --> Transition["⏭️ NEXT MODE:<br>IMPLEMENT MODE"]

    %% Template References
    Level2Planning -.- TemplateL2["TEMPLATE L2:<br>- Overview<br>- Files to Modify<br>- Implementation Steps<br>- Simple Creative Decisions<br>- Potential Challenges"]
    Level3Planning -.- TemplateL34["TEMPLATE L3-4:<br>- Requirements Analysis<br>- Components Affected<br>- Architecture Considerations<br>- Complex Creative Decisions<br>- Implementation Strategy<br>- Detailed Steps<br>- Dependencies<br>- Challenges & Mitigations"]
    Level4Planning -.- TemplateL34

    %% Creative Phase Templates
    L2CreativePhase -.-> CreativeTemplateSimple["🎨 SIMPLE CREATIVE TEMPLATE:<br>- 🎨🎨 ENTERING CREATIVE PHASE<br>- Problem Description<br>- 2-3 Options<br>- Quick Analysis<br>- Selected Approach<br>- Implementation Notes<br>- 🎨🎨 EXITING CREATIVE PHASE"]
    L34CreativePhase -.-> CreativeTemplateComplex["🎨 COMPLEX CREATIVE TEMPLATE:<br>- 🎨🎨🎨 ENTERING CREATIVE PHASE<br>- Component Description<br>- Requirements & Constraints<br>- Multiple Options Analysis<br>- Recommended Approach<br>- Detailed Implementation Guidelines<br>- Verification Checkpoint<br>- 🎨🎨🎨 EXITING CREATIVE PHASE"]

    %% Validation Options
    Start -.-> Validation["🔍 VALIDATION OPTIONS:<br>- Review complexity level<br>- Create planning templates<br>- Identify creative needs<br>- Demonstrate creative process<br>- Generate design guidelines<br>- Show mode transition"]

    %% Styling
    style Start fill:#4da6ff,stroke:#0066cc,color:white
    style ReadTasks fill:#80bfff,stroke:#4da6ff,color:black
    style CheckLevel fill:#d94dbb,stroke:#a3378a,color:white
    style Level2Planning fill:#4dbb5f,stroke:#36873f,color:white
    style Level3Planning fill:#ffa64d,stroke:#cc7a30,color:white
    style Level4Planning fill:#ff5555,stroke:#cc0000,color:white
    style L2CreativePhase fill:#d971ff,stroke:#a33bc2,color:white
    style L34CreativePhase fill:#d971ff,stroke:#a33bc2,color:white
    style UpdateMemoryBank fill:#4dbbbb,stroke:#368787,color:white
    style Transition fill:#5fd94d,stroke:#3da336,color:white
```

## Key Rules:
- All Git operations in DESIGN mode MUST use the centralized Git Workflow Controller.
- Ensure all rule references use the `@<filename>` syntax for proper loading.

## Available Actions:
- **Start Design Mode**: Begin the integrated planning and creative design workflow.
- **QA**: Provide additional information, clarifications, or modifications at any step.

## General Tips:
- Provide clear and concise responses to prompts.
- Utilize web search (`@web`) for research during planning and creative phases.
- Document all design decisions thoroughly.