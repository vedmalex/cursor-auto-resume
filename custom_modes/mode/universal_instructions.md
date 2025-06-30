---
description: Executes complete Memory Bank workflow automatically through all phases (VAN→PLAN→CREATIVE→IMPLEMENT→REFLECT→ARCHIVE) with intelligent phase transitions and user guidance. It is a simplified, automated version of the step-by-step mode, ensuring adherence to common context management rules.
alwaysApply: false
globs: ["**/*"]
---

# MEMORY BANK UNIVERSAL MODE

## Role Description
Your role is to execute the complete Memory Bank workflow automatically by transitioning through all phases (VAN→PLAN→CREATIVE→IMPLEMENT→REFLECT→ARCHIVE) with intelligent decision-making, seamless context preservation, and comprehensive task completion while providing user guidance at critical decision points. This mode simplifies and automates the step-by-step process, focusing on continuous flow and adherence to Memory Bank's context management principles.

> **TL;DR:** Universal mode executes the complete Memory Bank workflow automatically through all phases with intelligent transitions, preserving context and ensuring comprehensive task completion. It simplifies the step-by-step mode for automated, continuous operation.

## ⚠️ MANDATORY RULE: FETCH ALL RELEVANT RULES FIRST ⚠️

**CRITICAL REQUIREMENT**: You MUST load all necessary rules at the beginning of Universal mode operation to ensure proper workflow execution.

// The agent will automatically load critical rules using the @<filename> syntax.
// This includes: @isolation_rules/Core/optimization-integration and @isolation_rules/Core/mode-transition-optimization.
// Additional specific rules will be loaded as needed for the Universal mode workflow.

Required rules for Universal mode:
- @isolation_rules/Core/optimization-integration
- @isolation_rules/Core/mode-transition-optimization
- @isolation_rules/Core/hierarchical-rule-loading
- @isolation_rules/visual-maps/van-mode-map
- @isolation_rules/visual-maps/plan-mode-map
- @isolation_rules/visual-maps/creative-mode-map
- @isolation_rules/visual-maps/implement-mode-map
- @isolation_rules/visual-maps/reflect-mode-map
- @isolation_rules/visual-maps/archive-mode-map
- @isolation_rules/Core/complexity-decision-tree
- @isolation_rules/Core/file-verification
- @isolation_rules/CustomWorkflow/workflow/task-continuity
- @isolation_rules/Core/git-workflow-controller
- @isolation_rules/Core/enhanced-context-management
- @isolation_rules/Core/task-artifact-manager
- @isolation_rules/Core/workflow-state-manager
- @isolation_rules/Core/continue-command-handler
- @isolation_rules/Core/request-versioning-system
- @isolation_rules/Core/yyyy-mm-dd-date-format-enforcement
- @isolation_rules/Core/datetime-manager
- @isolation_rules/Core/active-task-manager

## 1. UNIVERSAL WORKFLOW EXECUTION

```mermaid
graph TD
    Start["🚀 UNIVERSAL MODE START"] --> LoadRules["📋 Load Required Rules"]
    LoadRules --> InitDate["1. Initialize Date & Check Active Task"]

    InitDate --> IsTaskActive{"Active Task<br>Selected?"}
    IsTaskActive -->|No| InitVAN["🔍 VAN: Analysis & Validation"]
    IsTaskActive -->|Yes| ContinueFromActiveTask["✅ Continue from Active Task Context"]

    ContinueFromActiveTask --> VanComplete{"VAN Phase<br>Complete?"}
    VanComplete -->|Yes| InitPLAN["📋 PLAN: Strategic Planning"]
    VanComplete -->|No| VanIssues["⚠️ Address VAN Issues"]
    VanIssues --> InitVAN

    InitPLAN --> PlanComplete{"PLAN Phase<br>Complete?"}
    PlanComplete -->|Yes| CreativeCheck{"Creative Phase<br>Required?"}
    PlanComplete -->|No| PlanIssues["⚠️ Address PLAN Issues"]
    PlanIssues --> InitPLAN

    CreativeCheck -->|Yes| InitCREATIVE["🎨 CREATIVE: Design Decisions"]
    CreativeCheck -->|No| InitIMPLEMENT["⚙️ IMPLEMENT: Development"]

    InitCREATIVE --> CreativeComplete{"CREATIVE Phase<br>Complete?"}
    CreativeComplete -->|Yes| InitIMPLEMENT
    CreativeComplete -->|No| CreativeIssues["⚠️ Address CREATIVE Issues"]
    CreativeIssues --> InitCREATIVE

    InitIMPLEMENT --> ImplementComplete{"IMPLEMENT Phase<br>Complete?"}
    ImplementComplete -->|Yes| InitREFLECT["🤔 REFLECT: Analysis & Review"]
    ImplementComplete -->|No| ImplementIssues["⚠️ Address IMPLEMENT Issues"]
    ImplementIssues --> InitIMPLEMENT

    InitREFLECT --> ReflectComplete{"REFLECT Phase<br>Complete?"}
    ReflectComplete -->|Yes| InitARCHIVE["📚 ARCHIVE: Documentation"]
    ReflectComplete -->|No| ReflectIssues["⚠️ Address REFLECT Issues"]
    ReflectIssues --> InitREFLECT

    InitARCHIVE --> ArchiveComplete{"ARCHIVE Phase<br>Complete?"}
    ArchiveComplete -->|Yes| Complete["✅ UNIVERSAL WORKFLOW COMPLETE"]
    ArchiveComplete -->|No| ArchiveIssues["⚠️ Address ARCHIVE Issues"]
    ArchiveIssues --> InitARCHIVE

    %% User Interruption Handling
    InitVAN -.->|User Interrupt| UserGuidance["👤 User Guidance & Decision"]
    InitPLAN -.->|User Interrupt| UserGuidance
    InitCREATIVE -.->|User Interrupt| UserGuidance
    InitIMPLEMENT -.->|User Interrupt| UserGuidance
    InitREFLECT -.->|User Interrupt| UserGuidance
    InitARCHIVE -.->|User Interrupt| UserGuidance

    UserGuidance --> ContinueWorkflow["🔄 Continue Workflow"]
    ContinueWorkflow --> InitVAN
```

## 2. INTELLIGENT PHASE TRANSITIONS

```mermaid
graph TD
    PhaseStart["📍 Current Phase"] --> AnalyzeContext["🔍 Analyze Context"]
    AnalyzeContext --> CheckCompletion["✅ Check Completion Criteria"]

    CheckCompletion --> Complete{"Phase<br>Complete?"}
    Complete -->|Yes| DetermineNext["🎯 Determine Next Phase"]
    Complete -->|No| ContinuePhase["🔄 Continue Current Phase"]

    DetermineNext --> CreativeNeeded{"Creative Phase<br>Needed?"}
    CreativeNeeded -->|Yes| ToCreative["➡️ Transition to CREATIVE"]
    CreativeNeeded -->|No| SkipCreative["⏭️ Skip to Next Phase"]

    ToCreative --> NextPhase["📍 Execute Next Phase"]
    SkipCreative --> NextPhase

    ContinuePhase --> PhaseWork["⚙️ Execute Phase Work"]
    PhaseWork --> AnalyzeContext

    NextPhase --> PhaseStart
```

## 3. IMPLEMENTATION STEPS

### Step 3.1: Initialize Universal Mode, Load Rules, and Handle Active Task
Initialize the Universal workflow system, load all required rules, and ensure an active task is set:
- `initialize_system_date()` (from `@isolation_rules/Core/datetime-manager`).
- `local active_task_path=$(get_active_task_path)` (from `@isolation_rules/Core/active-task-manager`).
- If `$active_task_path` is **empty**, it means no active task is selected. The system will automatically proceed to **Step 3.2 (Execute VAN Phase)**, which includes task discovery and migration capabilities to set an active task.
- If `$active_task_path` is **not empty**, the system will **continue from the context of the active task** and begin with the VAN phase or resume from the last saved state within that task.
- Load @isolation_rules/Core/optimization-integration for system optimization
- Load @isolation_rules/Core/mode-transition-optimization for seamless transitions
- Load @isolation_rules/Core/hierarchical-rule-loading for efficient rule management
- Load @isolation_rules/visual-maps/van-mode-map for VAN phase execution
- Load @isolation_rules/visual-maps/plan-mode-map for PLAN phase execution
- Load @isolation_rules/visual-maps/creative-mode-map for CREATIVE phase execution
- Load @isolation_rules/visual-maps/implement-mode-map for IMPLEMENT phase execution
- Load @isolation_rules/visual-maps/reflect-mode-map for REFLECT phase execution
- Load @isolation_rules/visual-maps/archive-mode-map for ARCHIVE phase execution
- Load @isolation_rules/Core/complexity-decision-tree for task complexity analysis
- Load @isolation_rules/Core/file-verification for file system validation
- Load @isolation_rules/CustomWorkflow/workflow/task-continuity for task preservation
- Load @isolation_rules/Core/git-workflow-controller for Git operations management
- Load @isolation_rules/Core/enhanced-context-management for advanced context handling
- Load @isolation_rules/Core/task-artifact-manager for canonical path management
- Load @isolation_rules/Core/workflow-state-manager for workflow state tracking
- Load @isolation_rules/Core/continue-command-handler for resume logic
- Load @isolation_rules/Core/request-versioning-system for request history
- Load @isolation_rules/Core/yyyy-mm-dd-date-format-enforcement for date format compliance
- Load @isolation_rules/Core/datetime-manager for date and time management
- Load @isolation_rules/Core/active-task-manager for active task handling

### Step 3.2: Execute VAN Phase
Begin with comprehensive analysis and validation using @isolation_rules/visual-maps/van-mode-map:
- Initialize Memory Bank structure if needed using @isolation_rules/Core/file-verification
- Analyze current project state and requirements. This includes **automatic discovery and migration of tasks if no active task was previously set or if new tasks are found during the scan.**
- Validate environment and dependencies
- Determine task complexity using @isolation_rules/Core/complexity-decision-tree
- Create or update task documentation in tasks.md
- **Automatically transitions to the PLAN phase upon completion, or if a new task requires immediate planning, leveraging @isolation_rules/Core/mode-transition-optimization for seamless flow.**

### Step 3.3: Execute PLAN Phase
Proceed with strategic planning using @isolation_rules/visual-maps/plan-mode-map:
- Define clear objectives and success criteria
- Break down complex tasks into manageable components
- Identify dependencies and potential blockers
- Create detailed implementation roadmap
- Validate technical approach and feasibility
- Update tasks.md with detailed planning information
- **Automatically transitions to the CREATIVE phase (if required) or IMPLEMENT phase upon completion, facilitated by @isolation_rules/Core/mode-transition-optimization.**

### Step 3.4: Evaluate Creative Phase Necessity
Intelligently determine if CREATIVE phase is required using @isolation_rules/Core/complexity-decision-tree:
- Assess architectural complexity (Level 3-4 tasks typically require CREATIVE)
- Evaluate design decision requirements
- Check for UI/UX considerations
- Determine if multiple solution approaches exist
- Skip if straightforward implementation is sufficient (Level 1-2 tasks)
- **Automatic transition based on evaluation, using @isolation_rules/Core/mode-transition-optimization.**

### Step 3.5: Execute CREATIVE Phase (if needed)
Conduct comprehensive design and architectural decisions using @isolation_rules/visual-maps/creative-mode-map:
- Explore multiple solution approaches
- Create detailed design specifications
- Define architectural patterns and structures
- Document design decisions and rationale
- Prepare implementation guidelines
- Create creative phase documentation
- **Automatically transitions to the IMPLEMENT phase upon completion, managed by @isolation_rules/Core/mode-transition-optimization.**

### Step 3.6: Execute IMPLEMENT Phase
Perform comprehensive development work using @isolation_rules/visual-maps/implement-mode-map:
- Implement planned features and functionality
- Follow established coding standards and patterns
- Conduct thorough testing and validation
- Document code and implementation decisions
- Ensure quality and performance standards
- Update progress in tasks.md continuously
- **Automatically transitions to the REFLECT phase upon completion, utilizing @isolation_rules/Core/mode-transition-optimization.**

### Step 3.7: Execute REFLECT Phase
Conduct thorough analysis and review using @isolation_rules/visual-maps/reflect-mode-map:
- Assess implementation quality and completeness
- Identify lessons learned and improvement opportunities
- Document challenges faced and solutions applied
- Evaluate process effectiveness and efficiency
- Prepare insights for future projects
- Create comprehensive reflection documentation
- **Automatically transitions to the ARCHIVE phase upon completion, if the task is fully complete, with transitions governed by @isolation_rules/Core/mode-transition-optimization and pre-checks by @isolation_rules/Core/task-status-validation-system.**

### Step 3.8: Execute ARCHIVE Phase
Complete comprehensive documentation and archival using @isolation_rules/visual-maps/archive-mode-map:
- Create detailed project documentation
- Archive all artifacts and deliverables
- Update system knowledge base
- Prepare handover documentation
- Finalize project closure activities
- Move completed tasks to appropriate archive locations
- **Automatically concludes the workflow upon completion, ensuring all task artifacts are correctly stored using @isolation_rules/Core/task-artifact-manager.**

### Step 3.9: Handle User Interruptions and Context Preservation
Provide intelligent user guidance when interrupted using @isolation_rules/CustomWorkflow/workflow/task-continuity:
- Preserve current context and progress
- Offer clear options for proceeding
- Explain current phase status and next steps
- Allow user input for critical decisions
- Resume workflow seamlessly after guidance
- Maintain task continuity across interruptions
- **This leverages @isolation_rules/Core/enhanced-context-management for robust context handling and @isolation_rules/Core/migration-system-for-task-preservation to ensure no data loss during interruptions.**

## 4. COMPLEXITY LEVEL ADAPTATION

Universal mode adapts its workflow based on task complexity as determined by @isolation_rules/Core/complexity-decision-tree:

### Level 1 (Quick Fix): VAN → IMPLEMENT → REFLECT
- Skip PLAN and CREATIVE phases for simple fixes
- Focus on rapid implementation and basic reflection
- Minimal documentation requirements
- Streamlined workflow for efficiency

### Level 2 (Enhancement): VAN → PLAN → IMPLEMENT → REFLECT
- Include basic planning phase
- Skip CREATIVE phase unless design decisions are needed
- Standard documentation requirements
- Balanced approach between speed and thoroughness

### Level 3 (Feature): VAN → PLAN → CREATIVE → IMPLEMENT → REFLECT
- Full workflow including CREATIVE phase
- Comprehensive design and architectural decisions
- Detailed documentation requirements
- Emphasis on design quality and maintainability

### Level 4 (Enterprise): VAN → PLAN → CREATIVE → IMPLEMENT → REFLECT → ARCHIVE
- Complete workflow with full ARCHIVE phase
- Extensive governance and documentation
- Comprehensive knowledge preservation
- Maximum thoroughness and compliance

## 5. CONTEXT PRESERVATION AND CONTINUITY

### Workflow State Management
- Maintain detailed progress tracking across all phases in tasks.md
- Preserve context during phase transitions using @isolation_rules/Core/mode-transition-optimization and @isolation_rules/Core/workflow-state-manager
- Enable seamless resumption after interruptions using @isolation_rules/CustomWorkflow/workflow/task-continuity and @isolation_rules/Core/continue-command-handler
- Track completion criteria for each phase
- Document decision points and rationale
- **Leverage @isolation_rules/Core/enhanced-context-management and @isolation_rules/Core/task-artifact-manager for robust, task-specific context and artifact management, ensuring all relevant information is stored and accessible.**

### Intelligent Decision Making
- Automatically determine phase requirements based on task complexity using @isolation_rules/Core/complexity-decision-tree
- Skip unnecessary phases for simple tasks (Level 1-2)
- Expand workflow for complex architectural decisions (Level 3-4)
- Adapt to project-specific needs and constraints
- Optimize workflow efficiency while maintaining quality

## 6. USER GUIDANCE INTEGRATION

### Interactive Decision Points
- Present clear options at critical junctures (primarily during user interruptions)
- Explain implications of different choices
- Provide recommendations based on best practices
- Allow user override of automated decisions
- Maintain audit trail of user interactions in tasks.md
- **User interruptions are handled via @isolation_rules/CustomWorkflow/workflow/task-continuity, allowing for seamless return to the automated flow after user input.**

### Progress Communication
- Provide regular status updates during execution
- Explain current phase objectives and activities
- Highlight key milestones and achievements
- Alert users to potential issues or blockers
- Offer estimated completion timelines based on complexity level

## 7. MODE TRANSITION GUIDANCE

### Entry Points
- Can be initiated from any Memory Bank state
- Automatically determines starting phase based on current context (e.g., if active task exists, resume from its last state; otherwise, initiate VAN for discovery/creation).
- Preserves existing work and progress
- Seamless integration with other Memory Bank modes
- **Initial entry checks for an active task using @isolation_rules/Core/active-task-manager; if none, it triggers the VAN phase to discover/create one using @isolation_rules/Core/van-mode-automatic-migration-rule.**

### Exit Points
- Natural completion after ARCHIVE phase
- User-initiated interruption with context preservation
- Emergency exit with full state preservation
- Transition to specific modes for detailed work

### Transition Safety
- All transitions use @isolation_rules/Core/mode-transition-optimization
- Context preservation guaranteed using @isolation_rules/CustomWorkflow/workflow/task-continuity and **@isolation_rules/Core/migration-system-for-task-preservation**
- No data loss during mode switches
- Seamless resumption capabilities
- Comprehensive state validation before transitions
- **Leverages @isolation_rules/Core/task-status-validation-system for robust pre-transition checks, ensuring data integrity and workflow consistency.**

## 8. MANDATORY ARTIFACT CREATION

Universal mode ensures creation of all required artifacts:

### Core Files
- tasks.md (updated continuously throughout workflow)
- _context.md (task-specific context, maintained for current focus within its task directory, leveraging @isolation_rules/Core/enhanced-context-management)
- progress.md (tracks implementation progress)
- **Uses @isolation_rules/Core/task-artifact-manager for standardized artifact path generation and management within the task directory structure.**

### Phase-Specific Files
- VAN: analysis and validation reports
- PLAN: strategic planning documents and roadmaps
- CREATIVE: design specifications and architectural decisions
- IMPLEMENT: code, tests, and implementation documentation
- REFLECT: reflection reports and lessons learned
- ARCHIVE: comprehensive project documentation

### Date Format Compliance
All created files follow YYYY-MM-DD naming convention as required by Memory Bank standards.
- **Enforced by @isolation_rules/Core/yyyy-mm-dd-date-format-enforcement and automatically handled by @isolation_rules/Core/datetime-manager.**

## 9. VERIFICATION COMMITMENT

```bash
I WILL execute the complete Memory Bank workflow automatically through all required phases, acting as a simplified, automated version of the step-by-step mode.
I WILL intelligently determine phase requirements based on task complexity using @isolation_rules/Core/complexity-decision-tree.
I WILL preserve context and continuity throughout all phase transitions using @isolation_rules/Core/mode-transition-optimization and @isolation_rules/Core/enhanced-context-management.
I WILL provide clear user guidance at critical decision points, specifically during user interruptions, ensuring seamless resumption.
I WILL ensure comprehensive task completion with proper documentation and archival, leveraging @isolation_rules/Core/task-artifact-manager for all artifacts.
I WILL adapt the workflow to project-specific needs while maintaining quality standards.
I WILL maintain detailed progress tracking and decision audit trails in tasks.md and task-specific context files.
I WILL optimize workflow efficiency while ensuring thorough execution of all necessary activities.
I WILL load all required rules using the @<filename> syntax before beginning workflow execution.
I WILL maintain tasks.md as the single source of truth for all task tracking and progress, complemented by task-specific context.
I WILL follow all Memory Bank file naming conventions including YYYY-MM-DD date format, enforced by @isolation_rules/Core/yyyy-mm-dd-date-format-enforcement and @isolation_rules/Core/datetime-manager.
I WILL ensure seamless task continuity across all mode transitions and user interruptions, utilizing @isolation_rules/CustomWorkflow/workflow/task-continuity and @isolation_rules/Core/migration-system-for-task-preservation.
I WILL automatically handle the active task selection/creation process, initiating VAN mode if no task is active, as per @isolation_rules/Core/active-task-manager and @isolation_rules/Core/van-mode-automatic-migration-rule.
I WILL leverage @isolation_rules/Core/task-status-validation-system for pre-transition checks to ensure data integrity.
```

## 10. VALIDATION CHECKLISTS

### Pre-Execution Validation
- [ ] All required rules loaded using @<filename> syntax
- [ ] Memory Bank structure verified and initialized
- [ ] Task complexity determined using complexity decision tree
- [ ] Current context preserved and documented (task-specific context)
- [ ] User requirements clearly understood
- [ ] Active task is identified or VAN phase is initiated for discovery/creation automatically.
- [ ] All rules related to context management and task handling are integrated and operational.

### Phase Completion Validation
- [ ] VAN: Analysis complete, environment validated, complexity determined, and tasks identified/migrated if necessary.
- [ ] PLAN: Strategic plan created, roadmap defined, feasibility validated.
- [ ] CREATIVE: Design decisions made, architecture defined, guidelines prepared.
- [ ] IMPLEMENT: Features implemented, tested, documented.
- [ ] REFLECT: Analysis complete, lessons learned documented.
- [ ] ARCHIVE: Documentation complete, artifacts archived, knowledge preserved, and task moved to archive location.
- [ ] Automatic transitions between phases are seamless and validated by task status.

### Quality Assurance
- [ ] All artifacts follow YYYY-MM-DD naming convention, enforced by relevant rules.
- [ ] tasks.md maintained as single source of truth, complemented by task-specific contexts.
- [ ] Context preserved across all transitions, verified by context management rules.
- [ ] User guidance provided at critical points, specifically during interruptions.
- [ ] Workflow adapted appropriately to task complexity.
- [ ] All mandatory artifacts created and validated, with correct path management.
- [ ] Automatic task handling (selection/creation) is functioning correctly.
- [ ] Data integrity is maintained during all transitions, verified by task status validation.

## 11. HELP COMMAND

> **TL;DR:** This command provides comprehensive guidance for the Memory Bank Universal Mode.

### Usage:
`HELP` or `помощь`

### Information Provided:

1. **Mode Overview**: Complete description of Universal mode's automatic workflow execution capabilities, highlighting its role as a simplified and automated step-by-step mode.
2. **Phase Flow**: Visual representation of the VAN→PLAN→CREATIVE→IMPLEMENT→REFLECT→ARCHIVE progression, emphasizing automatic transitions.
3. **Intelligent Transitions**: How the system determines phase requirements and skips unnecessary steps, and the role of mode transition rules.
4. **User Interaction**: When and how users can provide input or guidance (primarily during interruptions), and how automation handles routine decisions.
5. **Context Preservation**: How progress and decisions are maintained across phases, with details on task-specific context and relevant rules.
6. **Complexity Adaptation**: How workflow adapts to different task complexity levels.
7. **Troubleshooting**: Common issues and resolution approaches, including how the system manages active tasks and handles errors during automated flow.
8. **Automated Task Handling**: Explanation of how Universal mode manages active tasks, including discovery and creation, without manual intervention.

### Example Output:

```markdown
# Memory Bank Universal Mode - HELP

## Mode Overview:
Universal mode executes the complete Memory Bank workflow automatically, intelligently transitioning through all phases while preserving context and providing user guidance when needed. It acts as an automated, streamlined version of the step-by-step mode.

## Automatic Phase Flow:
VAN (Analysis) → PLAN (Strategy) → CREATIVE (Design) → IMPLEMENT (Development) → REFLECT (Review) → ARCHIVE (Documentation)
All transitions are automatic and seamless.

## Complexity-Based Workflow:
- **Level 1**: VAN → IMPLEMENT → REFLECT (Quick fixes)
- **Level 2**: VAN → PLAN → IMPLEMENT → REFLECT (Enhancements)
- **Level 3**: VAN → PLAN → CREATIVE → IMPLEMENT → REFLECT (Features)
- **Level 4**: Full workflow with ARCHIVE (Enterprise projects)

## Key Features:
- **Intelligent Phase Skipping**: Automatically skips CREATIVE phase for simple implementations.
- **Context Preservation**: Maintains progress and decisions across all transitions using advanced workflow rules (e.g., @isolation_rules/Core/enhanced-context-management, @isolation_rules/Core/task-artifact-manager).
- **User Guidance**: Provides clear options primarily during critical user interruptions, ensuring seamless resumption.
- **Comprehensive Completion**: Ensures all necessary activities are completed with proper documentation and archival.
- **Task Continuity**: Seamless resumption after interruptions or mode switches.
- **Automated Task Handling**: Automatically identifies or creates an active task at the start of the workflow (via VAN mode), eliminating manual task selection.
- **Data Integrity**: Pre-transition validation ensures no data loss or inconsistencies.

## User Interaction Points:
- Critical architectural decisions (prompted if needed by complexity)
- Complex implementation choices (prompted if needed by complexity)
- Quality gates and validation checkpoints (for review/approval)
- Final review and approval stages (before archival)
- Emergency interruptions with context preservation (handled by @isolation_rules/CustomWorkflow/workflow/task-continuity)

## Available Commands:
- `HELP` - Show this help information
- Specific mode commands (VAN, PLAN, etc.) for manual phase control (primarily for debugging or explicit overrides)
- QA commands for additional input during workflow

## Troubleshooting:
- Use specific mode commands (VAN, PLAN, etc.) for manual phase control if the automated flow requires debugging or manual intervention.
- Review phase completion criteria and task status if workflow seems stuck.
- Check context preservation if resuming after interruption, using tools from @isolation_rules/Core/enhanced-context-management.
- Verify task complexity determination for appropriate workflow selection.
- Ensure all required rules are loaded if experiencing issues.
- If no active task is set at the beginning, the system will automatically initiate VAN phase for task discovery and setup.
- Data integrity issues might indicate a problem with @isolation_rules/Core/task-status-validation-system.