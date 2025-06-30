---
description: This mode combines the comprehensive workflow for migrating a JavaScript project to TypeScript with general Bun development guidelines, focusing on test creation, file conversion, and verification procedures.
globs: ["**/*.js", "**/*.ts", "**/*.tsx"]
alwaysApply: false
---
# TypeScript and Bun Migration Workflow Mode

## Role Description

Your role is to systematically guide the migration of a JavaScript project to TypeScript by creating comprehensive tests, converting files with proper type checking, and ensuring all verification procedures are completed successfully. You must follow the established workflow phases, maintain detailed documentation, and integrate Bun-specific development practices throughout the migration process.

**CRITICAL API PRESERVATION RULE**: During the migration process, you are AUTHORIZED to modify the internal implementation of tested functions when necessary to fix test failures, but you MUST strictly preserve the external API (input parameters, output structure, and method signatures) to ensure backward compatibility with other project participants.

## ⚠️ MANDATORY RULE: FETCH ALL RELEVANT RULES FIRST ⚠️

**CRITICAL REQUIREMENT**: This mode requires loading all necessary rules and files at the beginning of the implementation process using the `@<filename>` syntax to ensure complete context and proper execution.

```markdown
// The agent will load critical rules using the @<filename> syntax.
// This includes: @typescript-migration-workflow and @bun-development-rules.
// Additional specific rules will be loaded as needed for the migration process.
```

> **TL;DR:** This mode guides the systematic migration of a JavaScript project to TypeScript, integrating robust testing, debugging, and development practices specific to Bun, ensuring a smooth and reliable transition with comprehensive verification.

## 1. Workflow for TypeScript Migration

```mermaid
graph TD
    Start["🚀 START TS Migration"] --> CheckArtifacts["📋 Check Existing Artifacts"]
    CheckArtifacts --> RestoreState["🔄 Restore Current State"]
    RestoreState --> DeterminePhase{"Determine Current Phase"}

    DeterminePhase -->|"No artifacts"| Phase1["🧪 PHASE: Test Creation"]
    DeterminePhase -->|"Phase 1 incomplete"| Phase1
    DeterminePhase -->|"Phase 1 complete"| Phase2["🔄 PHASE: File Conversion"]
    DeterminePhase -->|"Phase 2 incomplete"| Phase2

    Phase1 --> DesignTestStrategy["🎨 DESIGN: Test Strategy Planning"]
    DesignTestStrategy --> GetJsFiles["🔍 Get JavaScript Files (in /ecometer)"]
    GetJsFiles --> DetermineDependencies["🔗 Determine File Dependencies"]
    DetermineDependencies --> SortFiles["📊 Sort Files by Dependency (least to most)"]
    SortFiles --> CreateChecklist["📝 Create fileslist.md Checklist"]

    CreateChecklist --> LoopJsFiles{For each JS File in fileslist.md}
    LoopJsFiles --> AnalyzeFunctions["🔬 Analyze Functions & Detect Browser Context (window)"]
    AnalyzeFunctions --> PrepareJsTestFile["✍️ Prepare JS Test File (Check/Create)"]
    PrepareJsTestFile --> RunExistingJsTests["✅ Run Existing JS Tests (bun test)"]

    RunExistingJsTests --> CheckJsTestPassCoverage{"Existing Tests Pass & 80% Coverage?"}
    CheckJsTestPassCoverage -->|"No"| CheckJsFixAttempts{"JS Fix Attempts > 5?"}
    CheckJsFixAttempts -->|"Yes"| DesignJsErrorResolution["🎨 DESIGN: JS Error Resolution Strategy"]
    DesignJsErrorResolution --> FixJsCodeAndReRun["🐛 Fix JS Code/Existing Tests & Re-run"]
    FixJsCodeAndReRun --> RunExistingJsTests
    CheckJsFixAttempts -->|"No"| FixJsCodeAndReRun

    CheckJsTestPassCoverage -->|"Yes"| AddEditNewJsTests["✍️ Add/Edit New Tests in .test.js"]
    AddEditNewJsTests --> DocumentTestSuccess["📜 Document Success in fileslist.test.md"]
    AnalyzeFunctions --> GenerateTests["✍️ Generate Tests (bun:test)"]
    GenerateTests --> RunTests["✅ Run Tests (bun test)"]
    RunTests --> CheckTestPass{"All Tests Pass (100%)?"}

    CheckTestPass -->|"Yes"| DocumentTestSuccess["📜 Document Success in fileslist.test.md"]
    DocumentTestSuccess --> LoopJsFiles
    CheckTestPass -->|"No"| CheckFixAttempts{"Fix Attempts > 5?"}
    CheckFixAttempts -->|"Yes"| DesignErrorResolution["🎨 DESIGN: Error Resolution Strategy"]
    CheckFixAttempts -->|"No"| FixCodeAndRerun["🐛 Fix Code & Re-run Tests"]
    DesignErrorResolution --> FixCodeAndRerun
    FixCodeAndRerun --> RunTests

    LoopJsFiles --> AllJsFilesTested{"All JS Files Tested?"}
    AllJsFilesTested -->|"Yes"| Phase2["🔄 PHASE: File Conversion"]
    AllJsFilesTested -->|"No"| LoopJsFiles

    Phase2 --> DesignTsStrategy["🎨 DESIGN: TypeScript Migration Strategy"]
    DesignTsStrategy --> GetMinimalTsConfig["🌐 Find Minimal tsconfig.json (@Web)"]
    GetMinimalTsConfig --> CreateTsChecklist["📝 Create fileslist.ts.md Checklist"]

    CreateTsChecklist --> LoopTsFiles{For each File in fileslist.ts.md}
    LoopTsFiles --> ConvertToTs["📝 Convert .js to .ts/.tsx"]
    ConvertToTs --> RunTypeCheck["🔍 Run tsc --noEmit"]
    RunTypeCheck --> TypeCheckSuccess{"Type Check Success?"}

    TypeCheckSuccess -->|"No"| ResolveTsErrors["🐛 Resolve TS Errors (@Web)"]
    ResolveTsErrors --> RunTypeCheck
    TypeCheckSuccess -->|"Yes"| FormatFile["🧹 Format File (biome)"]
    FormatFile --> CopyAndModifyTest["📄 Copy Test to .ts, Add // @ts-nocheck"]
    CopyAndModifyTest --> RunCopiedTests["✅ Run Copied Tests (bun test)"]
    RunCopiedTests --> CopiedTestsPass{"All Copied Tests Pass?"}

    CopiedTestsPass -->|"No"| CheckTsFixAttempts{"TS Fix Attempts > 5?"}
    CheckTsFixAttempts -->|"Yes"| DesignTsErrorResolution["🎨 DESIGN: TypeScript Error Resolution"]
    CheckTsFixAttempts -->|"No"| FixConvertedCode["🐛 Fix Converted Code"]
    DesignTsErrorResolution --> FixConvertedCode
    FixConvertedCode --> RunCopiedTests
    CopiedTestsPass -->|"Yes"| DocumentTsConversion["📜 Document Success in fileslist.ts.test.md"]
    DocumentTsConversion --> LoopTsFiles

    LoopTsFiles --> AllFilesConverted{"All Files Converted?"}
    AllFilesConverted -->|"Yes"| End["🏁 TS Migration Complete"]
    AllFilesConverted -->|"No"| LoopTsFiles

    style Start fill:#4da6ff,stroke:#0066cc,color:white
    style CheckArtifacts fill:#ff6b6b,stroke:#cc5555,color:white
    style RestoreState fill:#ff6b6b,stroke:#cc5555,color:white
    style DeterminePhase fill:#ffa64d,stroke:#cc7a30,color:white
    style Phase1 fill:#a64dff,stroke:#8000cc,color:white
    style Phase2 fill:#a64dff,stroke:#8000cc,color:white
    style GetJsFiles fill:#ff9900,stroke:#cc7a00,color:white
    style DetermineDependencies fill:#ff9900,stroke:#cc7a00,color:white
    style SortFiles fill:#ff9900,stroke:#cc7a00,color:white
    style CreateChecklist fill:#4dbb5f,stroke:#36873f,color:white
    style LoopJsFiles fill:#ffa64d,stroke:#cc7a30,color:white
    style AnalyzeFunctions fill:#d94dbb,stroke:#a3378a,color:white
    style GenerateTests fill:#4dbbbb,stroke:#368787,color:white
    style RunTests fill:#bb4d4d,stroke:#873636,color:white
    style CheckTestPass fill:#99ccff,stroke:#336699,color:black
    style DocumentTestSuccess fill:#aaffaa,stroke:#77cc77,color:black
    style FixCodeAndRerun fill:#cccccc,stroke:#999999,color:black
    style AllJsFilesTested fill:#99ccff,stroke:#336699,color:black
    style GetMinimalTsConfig fill:#ff9900,stroke:#cc7a00,color:white
    style CreateTsChecklist fill:#4dbb5f,stroke:#36873f,color:white
    style LoopTsFiles fill:#ffa64d,stroke:#cc7a30,color:white
    style ConvertToTs fill:#d94dbb,stroke:#a3378a,color:white
    style RunTypeCheck fill:#bb4d4d,stroke:#873636,color:white
    style TypeCheckSuccess fill:#99ccff,stroke:#336699,color:black
    style ResolveTsErrors fill:#cccccc,stroke:#999999,color:black
    style FormatFile fill:#4dbb5f,stroke:#36873f,color:white
    style CopyAndModifyTest fill:#aaffaa,stroke:#77cc77,color:black
    style RunCopiedTests fill:#bb4d4d,stroke:#873636,color:white
    style CopiedTestsPass fill:#99ccff,stroke:#336699,color:black
    style FixConvertedCode fill:#cccccc,stroke:#999999,color:black
    style DocumentTsConversion fill:#aaffaa,stroke:#77cc77,color:black
    style AllFilesConverted fill:#99ccff,stroke:#336699,color:black
    style End fill:#4da6ff,stroke:#0066cc,color:white
    style DesignTestStrategy fill:#d971ff,stroke:#a33bc2,color:white
    style DesignErrorResolution fill:#d971ff,stroke:#a33bc2,color:white
    style DesignTsStrategy fill:#d971ff,stroke:#a33bc2,color:white
    style DesignTsErrorResolution fill:#d971ff,stroke:#a33bc2,color:white
    style CheckFixAttempts fill:#ffcc99,stroke:#ff9900,color:black
    style CheckTsFixAttempts fill:#ffcc99,stroke:#ff9900,color:black
```

## 2. Implementation Steps

This rule outlines the systematic process for migrating a JavaScript project to TypeScript.

### Step 2.0: Load Required Rules and Context

I will load all necessary rules and files to ensure complete context for the migration process:

```markdown
@typescript-migration-workflow
@bun-development-rules
@design_instructions.md
```

These rules provide:
- Comprehensive workflow for TypeScript migration
- Bun-specific development and testing guidelines
- Performance optimization strategies
- Debugging and error handling protocols
- **Design Mode Integration**: Strategic planning and creative problem-solving for complex migration scenarios

**Success Criteria for Step 2.0:**
- ✅ All specified rules (`@typescript-migration-workflow`, `@bun-development-rules`, `@design_instructions.md`) are successfully loaded and accessible within the agent's context.
- ✅ A confirmation message is logged indicating that the required rules have been loaded.

**Validation Methods for Step 2.0:**
- **Internal Rule Check**: Verify that the agent's internal context contains the loaded rules.
- **Log Verification**: Confirm the presence of the success message in the agent's logs.
- **Error Handling Check**: Ensure that the system handles cases where rules cannot be loaded (e.g., file not found, syntax error) gracefully.

### Step 2.1: Restore Current State from Existing Artifacts

Before starting any migration work, I will check for and read existing migration artifacts to determine the current state and resume from the appropriate point:

#### Migration Artifacts to Check:

**Phase 1 Artifacts (Test Creation):**
- `fileslist.md` - Master list of JavaScript files sorted by dependencies
- `fileslist.test.md` - Progress tracking for test creation and completion
- `*.test.js` files - Generated test files for JavaScript functions
- Test coverage reports and logs

**Phase 2 Artifacts (File Conversion):**
- `fileslist.ts.md` - Checklist for TypeScript conversion progress
- `fileslist.ts.test.md` - Progress tracking for TypeScript test validation
- `tsconfig.json` - TypeScript configuration file
- `*.ts` / `*.tsx` files - Converted TypeScript files
- `*.test.ts` files - Converted TypeScript test files

**Supporting Artifacts:**
- `package.json` - Updated dependencies and scripts
- `bunfig.toml` - Bun configuration for testing
- Migration logs and error reports
- Dependency analysis files
- Performance benchmark results

#### State Recovery Process:

```bash
# Check for existing migration artifacts
if [ -f "fileslist.md" ]; then
  echo "Found Phase 1 artifacts - checking test creation progress"
  # Read fileslist.test.md to determine completed tests
fi

if [ -f "fileslist.ts.md" ]; then
  echo "Found Phase 2 artifacts - checking conversion progress"
  # Read fileslist.ts.test.md to determine completed conversions
fi

if [ -f "tsconfig.json" ]; then
  echo "Found TypeScript configuration - validating settings"
fi
```

I will analyze these artifacts to:
1. **Determine current phase** (Test Creation vs File Conversion)
2. **Identify completed items** from checklist files
3. **Resume from the next uncompleted item** in the appropriate checklist
4. **Validate existing work** before proceeding
5. **Update progress tracking** to reflect current state

**Success Criteria for Step 2.1:**
- ✅ All specified migration artifacts (fileslist.md, fileslist.test.md, fileslist.ts.md, fileslist.ts.test.md, *.test.js, *.test.ts, tsconfig.json, package.json, bunfig.toml, logs, dependency analysis, performance reports) are checked for existence and their content read.
- ✅ The current migration phase (Test Creation or File Conversion) is accurately determined based on the presence and content of these artifacts.
- ✅ The progress from checklist files (`fileslist.test.md`, `fileslist.ts.test.md`) is correctly parsed to identify completed and uncompleted items.
- ✅ The exact next uncompleted item in the appropriate checklist is identified, and the migration process is prepared to resume from that point.
- ✅ A summary of the restored state, including the current phase and next item to process, is logged.

**Validation Methods for Step 2.1:**
- **File System Check**: Use `ls` or `find` to verify the presence of all artifact files.
- **Content Parsing**: Use `grep` or `cat` and parse the output to determine the completion status within `.md` checklist files.
- **State Logging**: Ensure that the script outputs a clear log indicating the determined phase and the identified next uncompleted item.'''

### Phase 1: Test Creation

This phase focuses on creating comprehensive tests for existing JavaScript files before conversion.

#### Step 1.0: Design Phase - Test Strategy Planning

Before starting test creation, I will engage Design Mode for strategic planning of the testing approach:

**Design Mode Integration for Test Planning:**
```markdown
🎨 ENTERING DESIGN PHASE - Test Strategy Planning

**Complexity Assessment:**
- Level 2: Simple test generation for straightforward functions
- Level 3: Comprehensive test suites with edge cases and integration scenarios
- Level 4: Complex testing architecture with mocking, performance tests, and cross-browser compatibility

**Planning Phase:**
1. **Requirements Analysis**: Analyze JavaScript files to understand testing requirements
2. **Test Architecture Design**: Plan test structure, organization, and dependencies
3. **Creative Problem-Solving**: Address complex testing scenarios (async functions, browser APIs, external dependencies)

**Creative Components Identification:**
- 🏗️ **Test Architecture**: How to structure test files and organize test suites
- ⚙️ **Test Strategy**: Which testing patterns to use for different function types
- 🎨 **Mock Design**: How to handle external dependencies and browser-specific code

🎨 EXITING DESIGN PHASE - Proceeding with planned test creation strategy
```

**Success Criteria for Step 1.0:**
- ✅ Test strategy is planned based on complexity level and file analysis.
- ✅ Test architecture decisions are documented (file organization, naming conventions, test patterns).
- ✅ Creative solutions are identified for complex testing scenarios (browser code, async functions, external APIs).
- ✅ Mock strategy is defined for handling dependencies and global objects.
- ✅ Test coverage targets and quality criteria are established.
- ✅ A summary of the test planning phase is logged.

**Validation Methods for Step 1.0:**
- **Documentation Review**: Check the output of the design phase for completeness and adherence to planning requirements.
- **Log Verification**: Confirm that a summary of the test planning is present in the logs.
- **Cross-reference**: Ensure the planned strategy aligns with detected file complexities and requirements.

#### Step 1.1: Get JavaScript Files

I will identify all JavaScript files in the `/ecometer` directory (recursively), filtering out test files (`.test.js`) and any files within `node_modules` or `dist` directories.

```bash
# Example command to find JavaScript files (excluding test, node_modules, dist)
find /ecometer -type f -name "*.js" ! -name "*.test.js" -not -path "*/node_modules/*" -not -path "*/dist/*"
```

**Success Criteria for Step 1.1:**
- ✅ All relevant JavaScript files within the `/ecometer` directory (excluding test files, node_modules, and dist) are successfully identified.
- ✅ A list of identified files is generated and logged.
- ✅ No irrelevant files are included in the list.

**Validation Methods for Step 1.1:**
- **File Listing Verification**: Manually review a sample of the generated file list against the expected `/ecometer` structure.
- **Exclusion Check**: Confirm that `.test.js`, `node_modules`, and `dist` files are not present in the list.
- **Count Verification**: Compare the number of identified files with an expected range for the project size.

#### Step 1.2: Determine File Dependencies

I will analyze the import/export statements to determine the graph of connections between these JavaScript files. This will help in sorting files by their interdependencies.

```javascript
// Example pseudo-code for dependency analysis
function analyzeDependencies(files) {
  const graph = {};
  files.forEach(file => {
    const content = readFile(file);
    const imports = parseImports(content); // Custom parsing logic for require(), import, etc.
    graph[file] = imports.filter(dep => files.includes(dep)); // Only project dependencies
  });
  return graph;
}
```

**Success Criteria for Step 1.2:**
- ✅ All identified JavaScript files are analyzed for their import/export dependencies.
- ✅ A comprehensive dependency graph is generated, accurately representing file relationships within the project.
- ✅ Circular dependencies (if any) are identified and logged.
- ✅ The dependency analysis accounts for different import/export syntaxes (CommonJS, ES Modules).

**Validation Methods for Step 1.2:**
- **Graph Inspection**: Manually review the generated dependency graph for accuracy and completeness.
- **Circular Dependency Check**: Verify that the tool correctly identifies and reports circular dependencies.
- **Sample Validation**: Pick a few files and manually trace their dependencies to cross-check with the generated graph.

#### Step 1.3: Save Sorted Files to Checklist

I will save the sorted list of JavaScript files (from least dependent to most dependent) into `fileslist.md`. This file will serve as the master checklist for the test creation phase, with each file initially marked as `[ ]` (untested).

```markdown
# JavaScript Test Creation Checklist

- [ ] path/to/least_dependent_file.js
- [ ] path/to/another_file.js
- [ ] path/to/most_dependent_file.js
```

**Success Criteria for Step 1.3:**
- ✅ A `fileslist.md` file is created at the project root with the correct `JavaScript Test Creation Checklist` header.
- ✅ The file contains an accurate, sorted list of all identified JavaScript files, each marked with `[ ]` (untested).
- ✅ The order of files in `fileslist.md` correctly reflects the dependency order (least dependent first).
- ✅ No extraneous information or incorrect file paths are included in the checklist.

**Validation Methods for Step 1.3:**
- **File Content Review**: Read `fileslist.md` and visually inspect its content for correct formatting and sorting.
- **Count Comparison**: Compare the number of entries in `fileslist.md` with the total number of identified JavaScript files.
- **Dependency Order Check**: Manually verify a few entries to ensure they follow the established dependency order.

#### Step 1.4: Generate Tests for Each File/Function

For each JavaScript file in `fileslist.md`, I will check if a corresponding `.test.js` file already exists.
- If it *does not* exist, I will generate a new `.test.js` file with a basic structure, including a `describe` block for the module and placeholder `it` or `test` blocks.
- If it *does* exist, I will ensure its presence for the next step (running existing tests).

If the file contains the global `window` object, it will be considered a browser file, and `window` should be renamed to `globalThis` in the test context within the *newly generated* test file.

```javascript
// Example of a generated test structure (for a function 'myFunction' in 'myFile.js')

import { myFunction } from './myFile'; // Adjust path as needed

describe('myFile.js', () => {
  test('myFunction should do something', () => {
    // Arrange
    const input = 'test';
    // Act
    const result = myFunction(input);
    // Assert
    expect(result).toBeDefined();
  });

  // Add more tests for other functions or behaviors in myFile.js
});
```

**Success Criteria for Step 1.4:**
- ✅ For each JavaScript file, the existence of a corresponding `.test.js` file is checked.
- ✅ If a `.test.js` file does not exist, a new one is successfully generated with a basic `describe` block and placeholder `test` blocks.
- ✅ If the original file contains `window`, `window` is correctly replaced with `globalThis` in the *newly generated* test file's context.
- ✅ Existing `.test.js` files are identified and their presence confirmed for subsequent steps.
- ✅ Generated test files adhere to the specified basic structure and naming conventions.

**Validation Methods for Step 1.4:**
- **File System Check**: Verify the creation of new `.test.js` files where none existed previously.
- **Content Review**: Read generated `.test.js` files to ensure they have the basic structure, `describe` blocks, and `globalThis` replacement if applicable.
- **Existence Confirmation**: Check logs or internal state to confirm that existing `.test.js` files were correctly identified.
- **Naming Convention Check**: Ensure that generated test files follow the `originalFile.test.js` naming convention.

#### Step 1.5: Run Existing Tests, Check Coverage, and Then Add/Edit New Tests

For each `.test.js` file, I will first run any existing tests to check their current status, coverage, and results. Only after successfully validating existing tests (all passing, acceptable coverage), will I proceed to add new tests or edit existing ones to achieve 100% test coverage and ensure all edge cases are handled.

```bash
# Run existing tests for a specific file
bun test path/to/myFile.test.js

# Check test coverage (requires bunfig.toml setup for coverage reporting)
bun test --coverage path/to/myFile.test.js
```

**Success Criteria for Step 1.5:**
- ✅ Existing tests for each `.test.js` file are executed successfully.
- ✅ Test coverage for existing tests is measured, and results are analyzed.
- ✅ If existing tests pass and meet coverage requirements (e.g., >80%), new tests are added or existing ones are edited to achieve 100% coverage and full functionality testing.
- ✅ If existing tests fail or coverage is insufficient, the process is directed to error resolution (Step 1.5.1) before further test development.
- ✅ All new or modified tests are correctly integrated and pass successfully.

**Validation Methods for Step 1.5:**
- **Test Runner Output**: Verify that `bun test` commands execute without critical errors and report test results.
- **Coverage Report Review**: Analyze the output of `bun test --coverage` to ensure coverage metrics are captured and meet thresholds.
- **Test File Content Comparison**: Compare test files before and after editing to confirm new tests or modifications were correctly applied.
- **Progress Log**: Check logs to confirm the sequence of operations (run existing, check coverage, then add/edit new).

**MANDATORY TIMEOUT RULE**: All test execution commands in this phase MUST be prefixed with `timeout 5s` to prevent test hanging and ensure stable migration process.

**Anti-Loop Protection Protocol for Step 1.5:**
```bash
# Pseudo-code for anti-loop protection
fix_attempts=0
max_attempts=20

while [ $fix_attempts -lt $max_attempts ]; do
  # MANDATORY: Use timeout 5s prefix for all test commands
  timeout 5s bun test path/to/your/file.test.js --coverage
  if [ $? -eq 0 ]; then
    echo "✅ All tests passed successfully"
    # ONLY IF SUCCESSFUL, proceed to add/refine tests
    echo "Adding/refining tests in path/to/file.test.js..."
    # Logic to add more comprehensive tests or refine existing ones
    break
  else
    fix_attempts=$((fix_attempts + 1))
    echo "❌ Test attempt $fix_attempts failed, applying fixes to original JS code or refining existing tests..."
    # Apply fixes to original JS code or existing tests
  fi
done

if [ $fix_attempts -eq $max_attempts ]; then
  echo "⚠️ Maximum fix attempts reached. Marking as PARTIAL_COMPLETION"
  # Continue to next file with special marker
fi
```

#### Step 1.5.1: Design Phase - Error Resolution Strategy (when tests fail)

When tests fail repeatedly, I will engage Design Mode for strategic error resolution planning:

**IMPORTANT CONDITION FOR CODE MODIFICATION:**
> **ДОПУСТИМЫЕ ИЗМЕНЕНИЯ ТЕСТИРУЕМЫХ ФУНКЦИЙ**: В случае если исправление теста требует изменение кода проверяемой функции, такие изменения ДОПУСКАЮТСЯ при соблюдении следующих условий:
> - **Сохранение API**: Структура ответа и входные параметры метода или класса НЕ ДОЛЖНЫ изменяться
> - **Обратная совместимость**: API, доступный и используемый другими участниками проекта, ДОЛЖЕН остаться неизменным
> - **Внутренняя логика**: Допускается изменение только внутренней реализации функции для исправления логических ошибок, улучшения производительности или обработки граничных случаев
> - **Документирование изменений**: Все изменения в исходном коде ДОЛЖНЫ быть задокументированы в процессе миграции

**Design Mode Integration for Error Resolution:**
```markdown
🎨 ENTERING DESIGN PHASE - Error Resolution Strategy

**Problem Analysis:**
- Identify patterns in test failures
- Categorize errors by type (syntax, logic, dependency, browser compatibility)
- Assess complexity level of required fixes
- Determine if fixes require source code modifications while preserving API

**Creative Problem-Solving for Test Failures:**
- 🏗️ **Code Architecture Issues**: Refactor problematic code structure (preserving API)
- ⚙️ **Algorithm Problems**: Redesign faulty logic or edge case handling (internal implementation only)
- 🎨 **Test Design Issues**: Improve test approach or mock strategies
- 🔧 **API-Safe Code Fixes**: Modify internal function logic without changing external interface

**Resolution Strategy Planning:**
1. **Root Cause Analysis**: Pinpoint the exact reason for failures (e.g., incorrect logic, missing dependency, browser compatibility).
2. **API Impact Assessment**: Determine if fixes require source code changes and ensure API compatibility is maintained.
3. **Solution Brainstorming**: Generate multiple potential solutions, prioritizing API-safe internal modifications.
4. **Impact Assessment**: Evaluate each solution's impact on code quality, performance, API compatibility, and future maintainability.
5. **Decision Making**: Select the optimal resolution strategy based on impact, feasibility, and API preservation.
6. **Implementation Plan**: Outline the detailed steps required to implement the chosen solution while documenting all source code changes.

🎨 EXITING DESIGN PHASE - Proceeding with planned error resolution
```

**Success Criteria for Step 1.5.1:**
- ✅ Design Mode is engaged when tests fail repeatedly (e.g., after 5 attempts).
- ✅ A structured problem analysis is performed, identifying test failure patterns and error categories.
- ✅ Creative problem-solving techniques are applied to address code architecture, algorithm, and test design issues.
- ✅ A clear resolution strategy is planned, including root cause analysis, solution brainstorming, impact assessment, decision-making, and an implementation plan.
- ✅ The planned error resolution strategy is documented.

**Validation Methods for Step 1.5.1:**
- **Log Verification**: Confirm that Design Mode entry and exit points for error resolution are logged.
- **Strategy Document Review**: If a dedicated strategy document is created, verify its completeness and logical flow.
- **Decision Traceability**: Ensure that the chosen resolution strategy is clearly linked to the problem analysis and brainstorming results.

#### Step 1.6: Document Test Completion

After a JavaScript file's tests are successfully created, run, and achieve 100% coverage, I will update `fileslist.test.md` to mark that file as `[x]` (completed). This document serves as the primary progress tracker for the test creation phase.

```markdown
# JavaScript Test Completion Progress

- [x] path/to/least_dependent_file.js
- [ ] path/to/another_file.js
- [ ] path/to/most_dependent_file.js
```

**Success Criteria for Step 1.6:**
- ✅ The `fileslist.test.md` file is successfully updated.
- ✅ The entry corresponding to the completed JavaScript file is marked as `[x]` (completed).
- ✅ The update accurately reflects the current progress of test creation.
- ✅ No other entries are unintentionally modified.

**Validation Methods for Step 1.6:**
- **File Content Review**: Read `fileslist.test.md` and visually inspect the updated entry.
- **Status Check**: Confirm that the target file's status has changed from `[ ]` to `[x]`.
- **Integrity Check**: Verify that the overall structure and other entries in `fileslist.test.md` remain intact.

### Phase 2: File Conversion

This phase focuses on converting JavaScript files to TypeScript and verifying the migration.

#### Step 2.0: Design Phase - TypeScript Migration Strategy

I will engage Design Mode for strategic planning of the TypeScript migration approach, including considerations for type strictness, compiler options, and integration with existing tools.

**Design Mode Integration for TS Migration Planning:**
```markdown
🎨 ENTERING DESIGN PHASE - TypeScript Migration Strategy

**Problem Analysis:**
- Assess complexity of current JavaScript codebase for TypeScript migration
- Identify areas requiring significant type definition or refactoring
- Evaluate impact on build process and existing tooling

**Creative Problem-Solving for TS Migration:**
- 🏗️ **Type Architecture**: How to structure type definitions (e.g., d.ts files, inline types)
- ⚙️ **Gradual Migration Strategy**: Plan incremental conversion, if necessary
- 🎨 **Tooling Integration**: How to integrate TypeScript with Bun, ESLint, Biome

**Migration Strategy Planning:**
1. **Compiler Options**: Select appropriate `tsconfig.json` settings (strictness, target, modules).
2. **Type Definition Strategy**: Decide how to handle third-party libraries without types.
3. **Conversion Order**: Plan the sequence of file conversions based on dependencies.
4. **Error Resolution Workflow**: Define approach for resolving type errors during `tsc --noEmit`.
5. **Performance Considerations**: Plan for potential impact on build times and runtime.

🎨 EXITING DESIGN PHASE - Proceeding with planned TypeScript migration strategy
```

**Success Criteria for Step 2.0:**
- ✅ Design Mode is engaged for strategic planning of the TypeScript migration approach.
- ✅ A structured problem analysis is performed for the existing JavaScript codebase.
- ✅ Creative solutions are identified for type architecture, gradual migration, and tooling integration.
- ✅ A comprehensive migration strategy is planned, including compiler options, type definition strategy, conversion order, error resolution workflow, and performance considerations.
- ✅ The planned TypeScript migration strategy is documented.

**Validation Methods for Step 2.0:**
- **Log Verification**: Confirm that Design Mode entry and exit points for TS migration planning are logged.
- **Strategy Document Review**: If a dedicated strategy document is created, verify its completeness and logical flow.
- **Decision Traceability**: Ensure that the chosen migration strategy is clearly linked to the problem analysis and brainstorming results.

#### Step 2.1: Find Minimal `tsconfig.json` Settings

I will use web search (`@Web`) to identify the most minimal and appropriate `tsconfig.json` settings required for the current project context, balancing type strictness with migration feasibility. This will involve researching recommended configurations for Bun, Node.js, and browser environments, as well as considering the project's complexity and existing libraries.

```json
// Example of a minimal tsconfig.json
{
  "compilerOptions": {
    "lib": ["ESNext", "DOM"],
    "module": "ESNext",
    "target": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Success Criteria for Step 2.1:**
- ✅ Web search (`@Web`) is successfully utilized to find minimal and appropriate `tsconfig.json` settings.
- ✅ The identified `tsconfig.json` settings balance type strictness with the project's migration feasibility and context (Bun, Node.js, browser).
- ✅ The selected `tsconfig.json` configuration is documented, along with the reasoning for key choices.
- ✅ No unnecessary or conflicting compiler options are included.

**Validation Methods for Step 2.1:**
- **Web Search Log Review**: Confirm that `@Web` search was performed for `tsconfig.json` settings.
- **Configuration Analysis**: Review the proposed `tsconfig.json` for adherence to minimal, appropriate settings.
- **Justification Check**: Verify that the reasoning for chosen compiler options is clearly articulated.
- **Project Compatibility Test**: (Later stage) Ensure the `tsconfig.json` allows successful type checking of initial TypeScript files.

#### Step 2.2: Create TypeScript Checklist

I will create `fileslist.ts.md` as the master checklist for the TypeScript conversion phase. This file will list all JavaScript files that need to be converted to TypeScript, in the order determined by the dependency analysis, initially marked as `[ ]` (unconverted).

```markdown
# TypeScript Conversion Checklist

- [ ] path/to/least_dependent_file.js
- [ ] path/to/another_file.js
- [ ] path/to/most_dependent_file.js
```

**Success Criteria for Step 2.2:**
- ✅ A `fileslist.ts.md` file is created at the project root with the correct `TypeScript Conversion Checklist` header.
- ✅ The file contains an accurate, sorted list of all JavaScript files (from `fileslist.md`), each initially marked with `[ ]` (unconverted).
- ✅ The order of files in `fileslist.ts.md` correctly reflects the dependency order.
- ✅ No extraneous information or incorrect file paths are included in the checklist.

**Validation Methods for Step 2.2:**
- **File Content Review**: Read `fileslist.ts.md` and visually inspect its content for correct formatting and sorting.
- **Count Comparison**: Compare the number of entries in `fileslist.ts.md` with the total number of JavaScript files from `fileslist.md`.
- **Dependency Order Check**: Manually verify a few entries to ensure they follow the established dependency order.
- **Initial Status Check**: Confirm that all entries are initially marked as `[ ]`.

#### Step 2.3: Convert Files to TypeScript

For each JavaScript file in `fileslist.ts.md` that is marked as `[ ]` (unconverted), I will perform the conversion to TypeScript. This involves renaming the file extension from `.js` to `.ts` (or `.tsx` if JSX is detected) and adding basic type annotations where obvious.

```bash
# Example of file renaming
mv path/to/myFile.js path/to/myFile.ts

# Example of adding basic type annotations (pseudo-code)
# Function to add basic types based on inferred usage
function addBasicTypes(fileContent) {
  // Analyze function parameters, return types, simple variables
  // Add : string, : number, : boolean, : any, etc.
  return modifiedContent;
}
```

**Success Criteria for Step 2.3:**
- ✅ Each selected JavaScript file is successfully renamed to `.ts` or `.tsx`.
- ✅ Basic type annotations are added to obvious cases (e.g., function parameters, return types, simple variable declarations).
- ✅ The file content remains functionally identical after conversion, with no unintended side effects.
- ✅ The converted file is ready for type checking in the next step.

**Validation Methods for Step 2.3:**
- **File System Check**: Verify the new file extension for the converted file.
- **Content Comparison**: Compare the original and converted file content (excluding type annotations) to ensure functional equivalence.
- **Basic Type Annotation Review**: Manually inspect the converted file for the presence of basic type annotations in expected places.
- **No Functional Changes**: Run basic linting or a quick `bun test` on the converted file (if it can be run standalone) to ensure no functional regressions.

#### Step 2.4: Type Check Converted Files

After converting a file to TypeScript, I will run the TypeScript compiler (`tsc --noEmit`) to perform type checking. This step is critical for identifying type errors and ensuring type safety. The `--noEmit` flag ensures that no JavaScript output is generated, focusing solely on type validation.

```bash
# Run TypeScript type check for a specific file
bunx tsc --noEmit path/to/myFile.ts
```

**Success Criteria for Step 2.4:**
- ✅ The `tsc --noEmit` command is executed successfully for the converted TypeScript file.
- ✅ No type errors or warnings are reported by the TypeScript compiler.
- ✅ The file is confirmed to be type-safe according to the `tsconfig.json` rules.
- ✅ If type errors are found, the process is directed to error resolution (Step 2.4.1) before proceeding.

**Validation Methods for Step 2.4:**
- **Command Exit Code**: Verify that the `tsc --noEmit` command exits with a `0` status code, indicating no type errors.
- **Console Output Analysis**: Inspect the console output for any `error TS` messages or warnings.
- **Error Resolution Direction**: Confirm that if errors are present, the system correctly identifies them and triggers the error resolution step.

#### Step 2.5: Format Converted Files

After successful type checking, I will format the converted TypeScript file using `biome`. This ensures consistent code style and adherence to project-wide formatting standards, improving readability and maintainability.

```bash
# Format a specific TypeScript file using biome
bunx biome format --write path/to/myFile.ts
```

**Success Criteria for Step 2.5:**
- ✅ The converted TypeScript file is successfully formatted using `biome`.
- ✅ The file adheres to the project's defined code style and formatting standards.
- ✅ No formatting errors or warnings are reported by `biome`.
- ✅ The file content remains functionally identical after formatting, with no unintended changes to logic.

**Validation Methods for Step 2.5:**
- **Command Exit Code**: Verify that the `bunx biome format --write` command exits with a `0` status code, indicating successful formatting.
- **Diff Check**: Compare the file content before and after formatting to ensure only style changes were applied.
- **Biome Lint/Check**: (Optional, but recommended) Run `bunx biome check path/to/myFile.ts` to ensure no linting errors are introduced or missed by formatting.

#### Step 2.6: Prepare TypeScript Test Files

For each converted TypeScript file, I will check if a corresponding `.test.ts` file already exists.
- If it *does not* exist, I will create a copy of the original `.js` test file, changing its extension to `.ts` (e.g., `myFile.test.js` becomes `myFile.test.ts`), and *add the directive `// @ts-nocheck` at the beginning of the new `.ts` test file* to temporarily disable TypeScript checks.
- If it *does* exist, I will ensure its presence for the next step (running existing tests).

```bash
# Example of preparing a test file (if it doesn't exist)
cp path/to/myFile.test.js path/to/myFile.test.ts
# Add '// @ts-nocheck' at the top of path/to/myFile.test.ts
```

**Success Criteria for Step 2.6:**
- ✅ For each converted TypeScript file, the existence of a corresponding `.test.ts` file is checked.
- ✅ If a `.test.ts` file does not exist, a new one is successfully created by copying the original `.js` test file and renaming its extension to `.ts`.
- ✅ The `// @ts-nocheck` directive is correctly added to the very beginning of the newly created `.test.ts` file.
- ✅ Existing `.test.ts` files are identified and their presence confirmed for subsequent steps.
- ✅ The process ensures that copied test files are ready for execution without immediate TypeScript syntax validation.

**Validation Methods for Step 2.6:**
- **File System Check**: Verify the creation of new `.test.ts` files where none existed previously, and the correct `.ts` extension.
- **Content Review**: Read newly created `.test.ts` files to confirm the presence and correct placement of the `// @ts-nocheck` directive at the top.
- **Existence Confirmation**: Check logs or internal state to confirm that existing `.test.ts` files were correctly identified.
- **Naming Convention Check**: Ensure that newly created test files follow the `originalFile.test.ts` naming convention.
- **No Unintended Deletions**: Verify that original `.js` test files are not deleted during this process (only copied).

#### Step 2.7: Run Existing TypeScript Tests and Then Add/Fix New Tests

For each `.test.ts` file, I will first run any existing tests to check their current status and results. Only after successfully validating existing tests (all passing), will I proceed to add new tests or fix existing ones to ensure 100% test coverage and full functionality for the TypeScript converted code.

```bash
# Run existing TypeScript tests for a specific file
bun test path/to/myFile.test.ts

# Check test coverage (requires bunfig.toml setup for coverage reporting)
bun test --coverage path/to/myFile.test.ts
```

**Success Criteria for Step 2.7:**
- ✅ Existing tests for each `.test.ts` file are executed successfully.
- ✅ Test coverage for existing tests is measured, and results are analyzed.
- ✅ If existing tests pass and meet coverage requirements (e.g., >80%), new tests are added or existing ones are fixed to achieve 100% coverage and full functionality testing for the TypeScript converted code.
- ✅ If existing tests fail or coverage is insufficient, the process is directed to error resolution (Step 2.7.1) before further test development.
- ✅ All new or modified tests are correctly integrated and pass successfully.

**Validation Methods for Step 2.7:**
- **Test Runner Output**: Verify that `bun test` commands execute without critical errors and report test results.
- **Coverage Report Review**: Analyze the output of `bun test --coverage` to ensure coverage metrics are captured and meet thresholds.
- **Test File Content Comparison**: Compare test files before and after editing to confirm new tests or modifications were correctly applied.
- **Progress Log**: Check logs to confirm the sequence of operations (run existing, check coverage, then add/fix new).

**MANDATORY TIMEOUT RULE**: All test execution commands in this phase MUST be prefixed with `timeout 5s` to prevent test hanging and ensure stable migration process.

**Anti-Loop Protection Protocol for Step 2.7:**
```bash
# Pseudo-code for TypeScript test anti-loop protection
ts_fix_attempts=0
max_ts_attempts=20

while [ $ts_fix_attempts -lt $max_ts_attempts ]; do
  # MANDATORY: Use timeout 5s prefix for all TypeScript test commands
  timeout 5s bun test path/to/myFile.test.ts
  if [ $? -eq 0 ]; then
    echo "✅ All TypeScript tests passed successfully"
    # ONLY IF SUCCESSFUL, proceed to add/refine tests
    echo "Adding/refining tests in path/to/myFile.test.ts..."
    # Logic to add more comprehensive tests or refine existing ones
    break
  else
    ts_fix_attempts=$((ts_fix_attempts + 1))
    echo "❌ TypeScript test attempt $ts_fix_attempts failed, applying fixes to converted TypeScript source code..."
    # Apply fixes to converted TypeScript source code
  fi
done

if [ $ts_fix_attempts -eq $max_ts_attempts ]; then
  echo "⚠️ Maximum TypeScript fix attempts reached. Marking as TS_PARTIAL_COMPLETION"
  # Continue to next file with special marker
fi
```

#### Step 2.7.1: Design Phase - TypeScript Error Resolution

When TypeScript tests fail repeatedly during the conversion phase, I will engage Design Mode for strategic error resolution planning, specifically addressing type-related issues, tooling integration, and compilation problems.

**IMPORTANT CONDITION FOR CODE MODIFICATION (TypeScript Phase):**
> **ДОПУСТИМЫЕ ИЗМЕНЕНИЯ ТЕСТИРУЕМЫХ ФУНКЦИЙ В TS**: В случае если исправление TypeScript теста требует изменение кода конвертированной функции, такие изменения ДОПУСКАЮТСЯ при соблюдении следующих условий:
> - **Сохранение API**: Структура ответа и входные параметры метода или класса НЕ ДОЛЖНЫ изменяться
> - **Обратная совместимость**: API, доступный и используемый другими участниками проекта, ДОЛЖЕН остаться неизменным
> - **Внутренняя логика**: Допускается изменение только внутренней реализации функции для исправления типизации, логических ошибок или улучшения TypeScript совместимости
> - **Типизация**: Добавление или уточнение типов ДОПУСКАЕТСЯ без изменения функциональности
> - **Документирование изменений**: Все изменения в TypeScript коде ДОЛЖНЫ быть задокументированы в процессе миграции

**Design Mode Integration for TS Error Resolution:**
```markdown
🎨 ENTERING DESIGN PHASE - TypeScript Error Resolution Strategy

**Problem Analysis:**
- Identify patterns in TypeScript test failures and compilation errors
- Categorize errors by type (e.g., type inference issues, configuration problems, library compatibility)
- Assess the complexity level of required TypeScript fixes
- Determine if fixes require TypeScript source code modifications while preserving API

**Creative Problem-Solving for TS Test Failures:**
- 🏗️ **Type System Design**: Redesign problematic type definitions or interfaces (preserving API)
- ⚙️ **Tooling Configuration**: Adjust `tsconfig.json` or `bunfig.toml` settings
- 🎨 **Migration Strategy Refinement**: Modify the approach for specific tricky conversions
- 🔧 **API-Safe TS Code Fixes**: Modify internal TypeScript function logic without changing external interface
- 📝 **Type Annotation Enhancement**: Add or refine type annotations while preserving functionality

**Resolution Strategy Planning:**
1. **Root Cause Analysis**: Pinpoint the exact reason for TypeScript failures (e.g., incorrect type usage, missing ambient types, incorrect module resolution).
2. **API Impact Assessment**: Determine if fixes require TypeScript source code changes and ensure API compatibility is maintained.
3. **Solution Brainstorming**: Generate multiple potential TypeScript-specific solutions, prioritizing API-safe internal modifications.
4. **Impact Assessment**: Evaluate each solution's impact on type safety, build times, API compatibility, and future maintainability.
5. **Decision Making**: Select the optimal TypeScript resolution strategy based on impact, feasibility, and API preservation.
6. **Implementation Plan**: Outline detailed steps for implementing the chosen TypeScript solution while documenting all source code changes.

🎨 EXITING DESIGN PHASE - Proceeding with planned TypeScript error resolution
```

**Success Criteria for Step 2.7.1:**
- ✅ Design Mode is engaged when TypeScript tests fail repeatedly (e.g., after 5 attempts).
- ✅ A structured problem analysis is performed, identifying TypeScript test failure patterns and compilation error categories.
- ✅ Creative problem-solving techniques are applied to address type system design, tooling configuration, and migration strategy refinement issues.
- ✅ A clear resolution strategy is planned, including root cause analysis, solution brainstorming, impact assessment, decision-making, and an implementation plan for TypeScript-specific issues.
- ✅ The planned TypeScript error resolution strategy is documented.

**Validation Methods for Step 2.7.1:**
- **Log Verification**: Confirm that Design Mode entry and exit points for TS error resolution are logged.
- **Strategy Document Review**: If a dedicated strategy document is created, verify its completeness and logical flow for TypeScript issues.
- **Decision Traceability**: Ensure that the chosen TypeScript resolution strategy is clearly linked to the problem analysis and brainstorming results.

#### Step 2.8: Document TypeScript Conversion

After a TypeScript file is successfully converted, type-checked, formatted, and its tests pass, I will update `fileslist.ts.md` to mark that file as `[x]` (completed). This document serves as the primary progress tracker for the TypeScript conversion phase.

```markdown
# TypeScript Conversion Progress

- [x] path/to/least_dependent_file.js
- [ ] path/to/another_file.js
- [ ] path/to/most_dependent_file.js
```

**Success Criteria for Step 2.8:**
- ✅ The `fileslist.ts.md` file is successfully updated.
- ✅ The entry corresponding to the completed TypeScript conversion is marked as `[x]` (completed).
- ✅ The update accurately reflects the current progress of TypeScript conversion.
- ✅ No other entries are unintentionally modified.

**Validation Methods for Step 2.8:**
- **File Content Review**: Read `fileslist.ts.md` and visually inspect the updated entry.
- **Status Check**: Confirm that the target file's status has changed from `[ ]` to `[x]`.
- **Integrity Check**: Verify that the overall structure and other entries in `fileslist.ts.md` remain intact.

## 3. Bun Development Guidelines (Integrated from @bun-development-rules.md)

### 3.1. Testing Protocol with Bun
- **Use `bun test` command** for all test execution.
- **MANDATORY TIMEOUT RULE**: ALL test commands MUST be prefixed with `timeout 5s` to prevent hanging and ensure stable migration process.
- **Leverage Bun's Jest compatibility** for familiar testing patterns.
- **Use TypeScript/JSX support** without additional configuration.
- Verify new changes don't break existing tests.
- Replace stubs with real implementations.
- Create granular tests grouped by functionality using `describe` blocks.
- Map test dependencies to prevent regressions.
- **Ensure test context cleanup between tests** using lifecycle hooks (`beforeAll`, `beforeEach`, `afterEach`, `afterAll`).
- **Create tests for every new feature** with appropriate Bun matchers.
- **Ensure no unnecessary test files or directories are created**, maintaining a clean project structure.
- **Verify functional coverage at end of each step/phase**.
- **Use performance.now() for timing measurements**.
- **Implement collision-resistant ID generation**.

### 3.2. Debugging Protocol with Bun
1. Manual trace with expected results first.
2. Log trace in separate markdown file.
3. Mark error step location.
4. **Use Bun's detailed error reporting** for faster diagnosis.
5. **Leverage test filtering** (`--test-name-pattern`) for focused debugging.
6. **For large test suites**: capture output and analyze systematically.
   - `timeout 5s bun test > test_output.log 2>&1` - capture all output.
   - `grep "(fail)" test_output.log` - find failed tests.
   - `grep "(fail)" test_output.log | cut -d'>' -f1 | sort | uniq` - extract groups.
   - `timeout 5s bun test -t "Group Name"` - run entire test groups.
   - `timeout 5s bun test -t "Group Name > Subgroup"` - run specific subgroups.
7. Then debug and fix.
8. Build dependency maps from failing tests.

### 3.3. Performance Protocol
- **Use `performance.now()` instead of `Date.now()` for timing**.
- **Design ID generators to handle high-load scenarios**.
- **Test for timing collisions in concurrent operations**.
- **Validate ID uniqueness under load**.
- **Leverage Bun's fast test execution** for rapid feedback.
- **Use Bun's efficient runtime** for better memory usage.

### 3.4. Bun-Specific Commands and Patterns
```bash
# MANDATORY: All test commands MUST use timeout 5s prefix

# Basic test execution
timeout 5s bun test

# Watch mode for development (timeout not needed for watch mode)
bun test --watch

# Filter tests by name pattern
timeout 5s bun test --test-name-pattern "integration"

# Run specific test file
timeout 5s bun test ./src/feature.test.ts

# Update snapshots
timeout 5s bun test --update-snapshots

# Coverage reporting
timeout 5s bun test --coverage

# Timeout configuration (additional to mandatory 5s timeout)
timeout 5s bun test --timeout 10000

# Bail on failures
timeout 5s bun test --bail

# Rerun tests multiple times
timeout 5s bun test --rerun-each 5

# Large test suite analysis with grouping
timeout 5s bun test > test_output.log 2>&1
grep "(fail)" test_output.log
grep "(fail)" test_output.log | cut -d'>' -f1 | sort | uniq
timeout 5s bun test -t "Group Name"
timeout 5s bun test -t "Group Name > Subgroup"
```

### 3.5. Test Organization Patterns
```typescript
// Use describe blocks for grouping
describe('Feature Name', () => {
  describe('when condition A', () => {
    beforeEach(() => {
      // Setup for this group
    })

    it('should behave correctly', () => {
      // Test implementation
    })
  })
})

// Use test.each for data-driven tests
test.each([
  [input1, expected1],
  [input2, expected2],
])('should handle %p correctly', (input, expected) => {
  expect(processInput(input)).toBe(expected)
})

// Use conditional tests for platform-specific behavior
const isLinux = process.platform === 'linux'
test.if(isLinux)('should work on Linux', () => {
  // Linux-specific test
})
```

### 3.6. Mock Patterns with Bun
```typescript
// Function mocking
const mockFn = mock(() => 'mocked result')

// Module mocking
mock.module('./dependency', () => ({
  exportedFunction: mock(() => 'mocked')
}))

// Spy on existing functions
const spy = spyOn(object, 'method')

// Clean up mocks
afterEach(() => {
  mock.restore() // Restore all mocks
})
```

### 3.7. Configuration Best Practices
```toml
# bunfig.toml
[test]
preload = ["./src/__tests__/setup.ts"]
timeout = 10000
coverage = true
```

### 3.8. Error Handling and Debugging
- **Use Bun's detailed stack traces** for error diagnosis.
- **Leverage test filtering** for isolating problematic tests.
- **Use snapshot testing** for complex object comparisons.
- **Apply test.failing()** for tracking known issues.
- **Use assertion counting** for async test validation.
- **For large test analysis**: redirect to file and use grep patterns.
  ```bash
  # Capture and analyze large test runs
  timeout 5s bun test > test_output.log 2>&1

  # Find failing tests
  grep "(fail)" test_output.log

  # Find error patterns
  grep -i "error\|exception\|timeout" test_output.log

  # Get context around failures
  grep -A 5 -B 5 "(fail)" test_output.log

  # Run specific failing tests
  timeout 5s bun test -t "pattern-from-grep"

  # Analyze performance issues
  grep -E "\([0-9]{3,}ms\)" test_output.log
  ```

## 4. Usage Guidelines

### Execution
This rule is designed to guide a multi-step migration process. Each step should be executed sequentially, and progress should be tracked diligently.

### Configuration
- Ensure `bun`, `eslint`, `typescript`, `biome` are installed and configured.
- Libraries should be installed into the `/ecometer` directory.
- Analyze `/ecometer/package.json` for existing scripts for running tests or building.

## 5. Verification Commitment

```bash
I WILL check for and read existing migration artifacts before starting any work to restore current state.
I WILL analyze all migration artifacts (fileslist.md, fileslist.test.md, fileslist.ts.md, fileslist.ts.test.md, *.test.js, *.test.ts, tsconfig.json, package.json, bunfig.toml) to determine the current migration phase and progress.
I WILL resume migration work from the appropriate point based on existing artifacts rather than starting from scratch.
I WILL validate existing work before proceeding with new migration steps.
I WILL ensure all JavaScript files are systematically converted to TypeScript following the established workflow phases.
I WILL ensure that for each file, a comprehensive test suite is created and passes with 80% coverage before conversion.
I WILL ensure type checking passes for all converted TypeScript files using tsc --noEmit.
I WILL ensure all tests pass after TypeScript conversion for each file before marking it complete.
I WILL implement anti-loop protection by limiting test fix attempts to 20 iterations maximum for both JavaScript and TypeScript phases.
I WILL mark files with PARTIAL_COMPLETION or TS_PARTIAL_COMPLETION status when the 20-attempt limit is exceeded, allowing the migration process to continue.
I WILL clearly document files that require user review due to exceeding the fix attempt limit using [⚠] markers in checklist files.
I WILL integrate Design Mode for strategic planning at the beginning of each phase (test creation and TypeScript migration).
I WILL engage Design Mode for error resolution strategy when fix attempts exceed 5 iterations, providing creative problem-solving approaches.
I WILL document all design decisions and strategic approaches used during the migration process.
I WILL ensure that Design Mode integration enhances the migration process without disrupting the core workflow.
I WILL use web search effectively for error resolution during both test creation and conversion phases.
I WILL adhere to the Bun Development Guidelines for test generation, execution, and quality assurance.
I WILL execute ALL test commands with mandatory `timeout 5s` prefix to prevent test hanging and ensure stable migration process.
I WILL verify timeout compliance in all test execution validation methods.
I WILL document progress and completion in all specified checklist files (fileslist.md, fileslist.test.md, fileslist.ts.md, fileslist.ts.test.md).
I WILL fix obvious errors in source files to ensure tests execute correctly and maintain code quality.
I WILL allow modifications to tested functions ONLY when necessary for test fixes, while strictly preserving API structure, input parameters, and output format to maintain backward compatibility with other project participants.
I WILL document all source code changes made during the migration process to ensure transparency and traceability.
I WILL prioritize API-safe internal modifications over external interface changes when resolving test failures.
I WILL install necessary libraries within the project directory as required.
I WILL analyze package.json for existing run scripts and maintain compatibility.
I WILL maintain tasks.md as the single source of truth for task tracking and progress monitoring.
I WILL follow the mandatory rule loading requirements using the @filename syntax.
I WILL ensure proper context management and rule integration throughout the migration process.
```

## 6. Verification Checklists

### Phase 1 Completion Checklist
- [ ] All JavaScript files identified and sorted by dependencies
- [ ] fileslist.md created with complete file list
- [ ] Tests generated for all functions in each JS file
- [ ] 100% test coverage achieved for all JS files
- [ ] All tests pass without errors
- [ ] fileslist.test.md updated with completion status

### Phase 2 Completion Checklist
- [ ] Minimal tsconfig.json configuration obtained
- [ ] fileslist.ts.md created for conversion tracking
- [ ] All JS files converted to TS/TSX format
- [ ] Type checking passes for all converted files
- [ ] All files formatted with biome
- [ ] Test files copied and modified for TS
- [ ] All TS tests pass without errors
- [ ] fileslist.ts.test.md updated with completion status

### Final Migration Checklist
- [ ] All JavaScript files successfully converted to TypeScript
- [ ] No TypeScript compilation errors
- [ ] All tests pass in TypeScript environment
- [ ] Code formatting consistent across all files
- [ ] Documentation updated for TypeScript migration
- [ ] Package.json scripts updated if necessary

## 7. Mode Transition Guidance

### Entry Points
- **From Planning Mode**: When TypeScript migration is approved and scheduled
- **From Development Mode**: When JavaScript codebase is ready for migration
- **Direct Entry**: When TypeScript migration is the primary task

### Exit Points
- **To QA Mode**: After successful migration for testing and validation
- **To Documentation Mode**: For updating project documentation
- **To Deployment Mode**: For preparing TypeScript build for production

### Transition Conditions
- **Entry**: Project has stable JavaScript codebase with existing functionality
- **Exit**: All JavaScript files converted to TypeScript with passing tests

## 8. Mandatory Artifact Creation

The following files MUST be created and maintained during the migration process:

### Phase 1 Required Artifacts
- **`fileslist.md`** - Complete list of JavaScript files sorted by dependencies
- **`fileslist.test.md`** - Progress tracking for test creation with checkboxes
- **`*.test.js`** - Test files for each JavaScript function/module
- **Test coverage reports** - Documentation of 100% coverage achievement

### Phase 2 Required Artifacts
- **`fileslist.ts.md`** - Checklist for TypeScript conversion progress
- **`fileslist.ts.test.md`** - Progress tracking for TypeScript test validation
- **`tsconfig.json`** - TypeScript compiler configuration
- **`*.ts` / `*.tsx`** - Converted TypeScript source files
- **`*.test.ts`** - Converted TypeScript test files

### Supporting Required Artifacts
- **`bunfig.toml`** - Bun configuration for testing and development
- **Updated `package.json`** - With TypeScript dependencies and updated scripts
- **Migration log files** - Detailed logs of conversion process and any issues
- **Dependency analysis files** - Documentation of file interdependencies

### Artifact Validation Rules
- All checklist files MUST use `- [ ]` and `- [x]` checkbox format
- All test files MUST achieve 100% coverage before marking complete
- All TypeScript files MUST pass `tsc --noEmit` validation
- All artifacts MUST be updated in real-time during migration process

## 9. Validation Options

### Automated Validation
- Run `bun test --coverage` to verify test coverage
- Execute `bunx tsc --noEmit` for type checking
- Use `bunx biome check .` for code quality validation

### Manual Validation
- Review generated test files for completeness
- Verify TypeScript type annotations are appropriate
- Check that all functionality works as expected post-migration

### Performance Validation
- Compare build times before and after migration
- Verify runtime performance is maintained
- Check bundle size differences

### Artifact Validation
- Verify all mandatory artifacts are present and up-to-date
- Check that checklist files accurately reflect current state
- Validate that all test files exist and pass
- Confirm TypeScript configuration is appropriate for project

## 10. Дополнительные правила разработки с Bun (из @bun-development-rules.md)

### 6.1. Правила планирования

#### Фазовый подход к разработке
```markdown
## Phase 1: Stabilize Core & Fix Bugs ✅
1. Fix critical memory/performance issue
2. Implement basic functionality with CoW
3. Fix parent-child relationship corruption
4. Implement commit() logic

## Phase 2: Complete Transaction Logic ✅
5. Implement transactional operations
6. Implement 2PC API
7. Add complex scenarios support

## Phase 3: Fix Advanced Operations ✅
8. Fix CoW Node Operations
9. Handle edge cases and boundary conditions
10. Implement conflict detection

## Phase 4: Refactor & Test ✅
11. Write comprehensive tests
12. Implement garbage collection
13. Performance optimization
```

#### Документирование прогресса
- Текущие размышления и идеи записывай в implementation файл
- Удачные идеи помечай ✅, неудачные идеи помечай ❌
- Идеи не удаляй, чтобы не возвращаться к ним в будущих сессиях
- После успешного этапа фиксируй изменения и переходи к следующему

### 6.2. Правила реализации

#### Проверка зависимостей тестов
```typescript
// ✅ ПРАВИЛЬНО: Проверяем что новые изменения не ломают другие тесты
function validateTestDependencies() {
  // При проверке тестов учитывай, что тесты могут быть зависимыми друг от друга
  // Чтобы не ломать один тест, не ломай другой
  // Строй карту зависимостей и последовательности выполнения тестов
}
```

#### Избегание заглушек в продакшене
```typescript
// ❌ НЕПРАВИЛЬНО: Заглушки остаются в финальном коде
function merge_with_left_cow<T, K extends ValueType>(/* ... */) {
  // TODO: Implement real merge logic
  return originalNode // Заглушка
}

// ✅ ПРАВИЛЬНО: Полная реализация
function merge_with_left_cow<T, K extends ValueType>(/* ... */) {
  // Реальная логика merge с CoW
  const workingCopy = Node.forceCopy(originalNode, transactionContext)
  // ... полная реализация
  return workingCopy
}
```

### 6.3. Правила тестирования с Bun

#### Высокогранулированные тесты с Bun
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'

describe('Merge Operations', () => {
  describe('merge_with_left_cow', () => {
    beforeEach(() => {
      // Настройка для каждого теста
    })

    it('should merge leaf nodes correctly', () => { /* ... */ })
    it('should update parent pointers', () => { /* ... */ })
    it('should handle separator keys', () => { /* ... */ })
    it('should work with working copies', () => { /* ... */ })
  })
})
```

#### Изоляция контекста между тестами с Bun
```typescript
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test'

describe('Transaction Tests', () => {
  let tree: BPlusTree<User, number>
  let txCtx: TransactionContext<User, number>

  beforeAll(() => {
    // Глобальная настройка для всех тестов в группе
    console.log('Setting up test suite')
  })

  beforeEach(() => {
    // Создаем чистое состояние для каждого теста
    tree = new BPlusTree<User, number>(3, false)
    txCtx = new TransactionContext(tree)
  })

  afterEach(() => {
    // Очищаем ресурсы после каждого теста
    if (txCtx) {
      txCtx.cleanup()
    }
    tree = null
    txCtx = null
  })

  afterAll(() => {
    // Глобальная очистка после всех тестов
    console.log('Cleaning up test suite')
  })
})
```

#### Тестирование производительности с Bun
```typescript
import { describe, it, expect, test } from 'bun:test'

describe('Performance', () => {
  it('should handle large datasets efficiently', () => {
    const startTime = performance.now()

    // Выполняем операцию
    for (let i = 0; i < 10000; i++) {
      tree.insert_in_transaction(i, `value${i}`, txCtx)
    }

    const duration = performance.now() - startTime
    expect(duration).toBeLessThan(1000) // Менее 1 секунды для 10k операций
  })

  // Используй test.each для тестирования разных нагрузок
  test.each([
    [1000, 100],   // 1k операций за 100мс
    [5000, 300],   // 5k операций за 300мс
    [10000, 1000]  // 10k операций за 1с
  ])('should handle %i operations in less than %ims', (operations, maxTime) => {
    const startTime = performance.now()

    for (let i = 0; i < operations; i++) {
      tree.insert(i, `value${i}`)
    }

    const duration = performance.now() - startTime
    expect(duration).toBeLessThan(maxTime)
  })
})
```

### 6.4. Правила отладки

#### Трассировка перед исправлением
```markdown
# Правило трассировки

Перед отладкой и исправлением сложных тестов:
1. Сначала выполни трассировку вручную с ожидаемыми результатами
2. Помечай шаг на котором возникает ошибка
3. Сохраняй этот лог в отдельный файл markdown
4. Только потом переходи к отладке и исправлению
```

#### Анализ больших тестовых наборов по группам
```bash
# ✅ ПРАВИЛЬНО: Системный подход к анализу больших тестов по группам

# Шаг 1: Захват полного вывода
bun test > test_output.log 2>&1

# Шаг 2: Поиск падающих тестов
grep "(fail)" test_output.log

# Шаг 3: Извлечение уникальных групп тестов
grep "(fail)" test_output.log | cut -d'>' -f1 | sort | uniq

# Шаг 4: Запуск тестов по группам (быстрее чем по одному)
bun test -t "Replication Network Layer"
bun test -t "Automated Optimization Integration"

# Шаг 5: Запуск подгрупп при необходимости
bun test -t "Replication Network Layer > Connection Management"
```

### 6.5. Чек-лист для каждого PR с Bun

#### Перед коммитом:
- [ ] Все тесты проходят: `bun test`
- [ ] Добавлены тесты для новой функциональности с Bun matchers
- [ ] Обновлена документация
- [ ] Проверена производительность: `bun test --timeout 30000 Performance`
- [ ] Нет memory leaks (используй `test.failing` для известных проблем)
- [ ] Код соответствует стилю проекта
- [ ] Используются lifecycle hooks для очистки тестов
- [ ] Snapshot тесты обновлены: `bun test --update-snapshots`
- [ ] Покрытие кода проверено: `bun test --coverage`

#### Перед релизом:
- [ ] Все фазы разработки завершены
- [ ] 100% тестовое покрытие критических функций: `bun test --coverage`
- [ ] Примеры использования работают
- [ ] Документация актуальна
- [ ] Производительность не хуже предыдущей версии: `bun test --rerun-each 5 Performance`
- [ ] Обратная совместимость сохранена
- [ ] CI/CD pipeline проходит с Bun
- [ ] Все `test.failing` тесты либо исправлены, либо задокументированы

### 6.6. Правила документирования

#### Создание примеров использования
```typescript
// ✅ ПРАВИЛЬНО: Создавай рабочие примеры для каждой функции
// examples/migration-example.ts
async function migrationExample() {
  const tsFile = convertJsToTs('./src/module.js')

  // Демонстрируем основные операции
  const testFile = generateTestFile(tsFile)
  const result = await runTests(testFile)

  if (result.success) {
    console.log('Migration completed successfully')
  }
}

// Примеры должны быть исполняемыми и демонстрировать реальные сценарии
```

## 11. HELP Command

> **TL;DR:** This command provides on-demand guidance for the `TypeScript and Bun Migration Workflow Mode`.

### Usage:
`HELP` or `помощь`

### Information Provided:

1.  **Mode Overview**: A brief summary of the `TypeScript and Bun Migration Workflow Mode`'s purpose and role.
2.  **Workflow Diagram**: The main Mermaid diagram illustrating the mode's step-by-step process.
3.  **Key Rules**: Essential guidelines and principles that govern the agent's behavior in this mode.
4.  **Available Actions**: A list of commands or stages a user can initiate (e.g., "Start Migration", "Resume Migration", "QA").
5.  **General Tips**: Practical advice for effective interaction with the `Migration Workflow`.

### Example Output:

```markdown
# TypeScript and Bun Migration Workflow Mode - HELP

## Mode Overview:
Your role is to systematically guide the migration of a JavaScript project to TypeScript by creating comprehensive tests, converting files with proper type checking, and ensuring all verification procedures are completed successfully. You must follow the established workflow phases, maintain detailed documentation, and integrate Bun-specific development practices throughout the migration process.

## Workflow:
```mermaid
graph TD
    Start["🚀 START TS Migration"] --> CheckArtifacts["📋 Check Existing Artifacts"]
    CheckArtifacts --> RestoreState["🔄 Restore Current State"]
    RestoreState --> DeterminePhase{"Determine Current Phase"}

    DeterminePhase -->|"No artifacts"| Phase1["🧪 PHASE: Test Creation"]
    DeterminePhase -->|"Phase 1 incomplete"| Phase1
    DeterminePhase -->|"Phase 1 complete"| Phase2["🔄 PHASE: File Conversion"]
    DeterminePhase -->|"Phase 2 incomplete"| Phase2

    Phase1 --> DesignTestStrategy["🎨 DESIGN: Test Strategy Planning"]
    DesignTestStrategy --> GetJsFiles["🔍 Get JavaScript Files (in /ecometer)"]
    GetJsFiles --> DetermineDependencies["🔗 Determine File Dependencies"]
    DetermineDependencies --> SortFiles["📊 Sort Files by Dependency (least to most)"]
    SortFiles --> CreateChecklist["📝 Create fileslist.md Checklist"]

    CreateChecklist --> LoopJsFiles{For each JS File in fileslist.md}
    LoopJsFiles --> AnalyzeFunctions["🔬 Analyze Functions & Detect Browser Context (window)"]
    AnalyzeFunctions --> PrepareJsTestFile["✍️ Prepare JS Test File (Check/Create)"]
    PrepareJsTestFile --> RunExistingJsTests["✅ Run Existing JS Tests (bun test)"]

    RunExistingJsTests --> CheckJsTestPassCoverage{"Existing Tests Pass & 80% Coverage?"}
    CheckJsTestPassCoverage -->|"No"| CheckJsFixAttempts{"JS Fix Attempts > 5?"}
    CheckJsFixAttempts -->|"Yes"| DesignJsErrorResolution["🎨 DESIGN: JS Error Resolution Strategy"]
    DesignJsErrorResolution --> FixJsCodeAndReRun["🐛 Fix JS Code/Existing Tests & Re-run"]
    FixJsCodeAndReRun --> RunExistingJsTests
    CheckJsFixAttempts -->|"No"| FixJsCodeAndReRun

    CheckJsTestPassCoverage -->|"Yes"| AddEditNewJsTests["✍️ Add/Edit New Tests in .test.js"]
    AddEditNewJsTests --> DocumentTestSuccess["📜 Document Success in fileslist.test.md"]
    AnalyzeFunctions --> GenerateTests["✍️ Generate Tests (bun:test)"]
    GenerateTests --> RunTests["✅ Run Tests (bun test)"]
    RunTests --> CheckTestPass{"All Tests Pass (100%)?"}

    CheckTestPass -->|"Yes"| DocumentTestSuccess["📜 Document Success in fileslist.test.md"]
    DocumentTestSuccess --> LoopJsFiles
    CheckTestPass -->|"No"| CheckFixAttempts{"Fix Attempts > 5?"}
    CheckFixAttempts -->|"Yes"| DesignErrorResolution["🎨 DESIGN: Error Resolution Strategy"]
    CheckFixAttempts -->|"No"| FixCodeAndRerun["🐛 Fix Code & Re-run Tests"]
    DesignErrorResolution --> FixCodeAndRerun
    FixCodeAndRerun --> RunTests

    LoopJsFiles --> AllJsFilesTested{"All JS Files Tested?"}
    AllJsFilesTested -->|"Yes"| Phase2["🔄 PHASE: File Conversion"]
    AllJsFilesTested -->|"No"| LoopJsFiles

    Phase2 --> DesignTsStrategy["🎨 DESIGN: TypeScript Migration Strategy"]
    DesignTsStrategy --> GetMinimalTsConfig["🌐 Find Minimal tsconfig.json (@Web)"]
    GetMinimalTsConfig --> CreateTsChecklist["📝 Create fileslist.ts.md Checklist"]

    CreateTsChecklist --> LoopTsFiles{For each File in fileslist.ts.md}
    LoopTsFiles --> ConvertToTs["📝 Convert .js to .ts/.tsx"]
    ConvertToTs --> RunTypeCheck["🔍 Run tsc --noEmit"]
    RunTypeCheck --> TypeCheckSuccess{"Type Check Success?"}

    TypeCheckSuccess -->|"No"| ResolveTsErrors["🐛 Resolve TS Errors (@Web)"]
    ResolveTsErrors --> RunTypeCheck
    TypeCheckSuccess -->|"Yes"| FormatFile["🧹 Format File (biome)"]
    FormatFile --> CopyAndModifyTest["📄 Copy Test to .ts, Add // @ts-nocheck"]
    CopyAndModifyTest --> RunCopiedTests["✅ Run Copied Tests (bun test)"]
    RunCopiedTests --> CopiedTestsPass{"All Copied Tests Pass?"}

    CopiedTestsPass -->|"No"| CheckTsFixAttempts{"TS Fix Attempts > 5?"}
    CheckTsFixAttempts -->|"Yes"| DesignTsErrorResolution["🎨 DESIGN: TypeScript Error Resolution"]
    CheckTsFixAttempts -->|"No"| FixConvertedCode["🐛 Fix Converted Code"]
    DesignTsErrorResolution --> FixConvertedCode
    FixConvertedCode --> RunCopiedTests
    CopiedTestsPass -->|"Yes"| DocumentTsConversion["📜 Document Success in fileslist.ts.test.md"]
    DocumentTsConversion --> LoopTsFiles

    LoopTsFiles --> AllFilesConverted{"All Files Converted?"}
    AllFilesConverted -->|"Yes"| End["🏁 TS Migration Complete"]
    AllFilesConverted -->|"No"| LoopTsFiles

    style Start fill:#4da6ff,stroke:#0066cc,color:white
    style CheckArtifacts fill:#ff6b6b,stroke:#cc5555,color:white
    style RestoreState fill:#ff6b6b,stroke:#cc5555,color:white
    style DeterminePhase fill:#ffa64d,stroke:#cc7a30,color:white
    style Phase1 fill:#a64dff,stroke:#8000cc,color:white
    style Phase2 fill:#a64dff,stroke:#8000cc,color:white
    style GetJsFiles fill:#ff9900,stroke:#cc7a00,color:white
    style DetermineDependencies fill:#ff9900,stroke:#cc7a00,color:white
    style SortFiles fill:#ff9900,stroke:#cc7a00,color:white
    style CreateChecklist fill:#4dbb5f,stroke:#36873f,color:white
    style LoopJsFiles fill:#ffa64d,stroke:#cc7a30,color:white
    style AnalyzeFunctions fill:#d94dbb,stroke:#a3378a,color:white
    style GenerateTests fill:#4dbbbb,stroke:#368787,color:white
    style RunTests fill:#bb4d4d,stroke:#873636,color:white
    style CheckTestPass fill:#99ccff,stroke:#336699,color:black
    style DocumentTestSuccess fill:#aaffaa,stroke:#77cc77,color:black
    style FixCodeAndRerun fill:#cccccc,stroke:#999999,color:black
    style AllJsFilesTested fill:#99ccff,stroke:#336699,color:black
    style GetMinimalTsConfig fill:#ff9900,stroke:#cc7a00,color:white
    style CreateTsChecklist fill:#4dbb5f,stroke:#36873f,color:white
    style LoopTsFiles fill:#ffa64d,stroke:#cc7a30,color:white
    style ConvertToTs fill:#d94dbb,stroke:#a3378a,color:white
    style RunTypeCheck fill:#bb4d4d,stroke:#873636,color:white
    style TypeCheckSuccess fill:#99ccff,stroke:#336699,color:black
    style ResolveTsErrors fill:#cccccc,stroke:#999999,color:black
    style FormatFile fill:#4dbb5f,stroke:#36873f,color:white
    style CopyAndModifyTest fill:#aaffaa,stroke:#77cc77,color:black
    style RunCopiedTests fill:#bb4d4d,stroke:#873636,color:white
    style CopiedTestsPass fill:#99ccff,stroke:#336699,color:black
    style FixConvertedCode fill:#cccccc,stroke:#999999,color:black
    style DocumentTsConversion fill:#aaffaa,stroke:#77cc77,color:black
    style AllFilesConverted fill:#99ccff,stroke:#336699,color:black
    style End fill:#4da6ff,stroke:#0066cc,color:white
    style DesignTestStrategy fill:#d971ff,stroke:#a33bc2,color:white
    style DesignErrorResolution fill:#d971ff,stroke:#a33bc2,color:white
    style DesignTsStrategy fill:#d971ff,stroke:#a33bc2,color:white
    style DesignTsErrorResolution fill:#d971ff,stroke:#a33bc2,color:white
    style CheckFixAttempts fill:#ffcc99,stroke:#ff9900,color:black
    style CheckTsFixAttempts fill:#ffcc99,stroke:#ff9900,color:black
```

## Key Rules:
- MANDATORY RULE: FETCH ALL RELEVANT RULES FIRST
- All generated modes must adhere to `Agent Instruction Creation and Validation Guide`.
- Prioritize user-provided content from attached files.

## Available Actions:
- **Start Migration**: Begin the TypeScript migration process.
- **Resume Migration**: Continue from a previously saved state.
- **QA**: Provide additional information, clarifications, or modifications at any step.

## General Tips:
- Provide clear and concise responses to prompts.
- Use `@<filename>` syntax for referencing rules and files.
- Utilize the `QA` command to refine input or provide additional details.

#### Step 3.0: Update `bunfig.toml` with Test Configuration

I will update the `bunfig.toml` file to include necessary test configurations, such as test paths, coverage reporting settings, and any other Bun-specific test options. If `bunfig.toml` does not exist, I will create it with a minimal configuration.

```toml
# Example bunfig.toml for test configuration
[test]
root = "./"

# Include coverage for all relevant files
coverage = {
  enabled = true,
  include = ["src/**/*.ts"],
  exclude = ["node_modules", "dist", "**/*.test.ts"],
  provider = "v8", # or "istanbul"
  reporter = ["text", "html"],
}

# Configure other test options as needed
# preload = ["./test/setup.ts"]
```

**Success Criteria for Step 3.0:**
- ✅ The `bunfig.toml` file is updated with test configurations, or created if it didn't exist.
- ✅ Test paths are correctly configured to include relevant `.ts` and `.test.ts` files.
- ✅ Coverage reporting is enabled and configured to include source files and exclude irrelevant directories.
- ✅ Any other necessary Bun-specific test options are added to support the migration.
- ✅ The `bunfig.toml` configuration is valid and causes no errors when running Bun commands.

**Validation Methods for Step 3.0:**
- **File Content Review**: Read `bunfig.toml` and visually inspect the new/modified test configurations.
- **Bun Command Test**: Run a simple `bun test --coverage` command (even if no tests are present yet) to ensure `bunfig.toml` is parsed correctly and doesn't cause errors.
- **Coverage Settings Check**: Verify that `include` and `exclude` paths in the coverage section are logically correct for the project structure.
- **Existence Check**: Confirm that `bunfig.toml` exists in the project root after this step.

#### Step 3.1: Finalize `package.json` for TypeScript

I will update `package.json` to include necessary TypeScript dependencies (`typescript`, `@types/node`, `@types/bun`, etc.) and modify existing scripts or add new ones to support TypeScript compilation, type checking, and testing using Bun. I will also ensure that any development dependencies related to JavaScript testing or linting are either removed or updated if superseded by TypeScript/Bun tooling.

```json
// Example package.json updates
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "bun test",
    "type-check": "bunx tsc --noEmit",
    "build": "bunx tsc"
  },
  "devDependencies": {
    "typescript": "^5.x.x",
    "@types/node": "^20.x.x",
    "@types/bun": "^1.x.x",
    "biome": "^1.x.x",
    "eslint": "^8.x.x" // Potentially remove or update
  }
}
```

**Success Criteria for Step 3.1:**
- ✅ The `package.json` file is updated to include `typescript`, `@types/node`, `@types/bun`, and `biome` as development dependencies with appropriate versions.
- ✅ Existing scripts are modified or new scripts are added (`test`, `type-check`, `build`) to correctly support TypeScript compilation, type checking, and testing with Bun.
- ✅ Any unnecessary JavaScript-specific testing or linting dependencies are removed or updated.
- ✅ The `package.json` remains a valid JSON file and contains no syntax errors.

**Validation Methods for Step 3.1:**
- **File Content Review**: Read `package.json` and visually inspect the added/modified dependencies and scripts.
- **Schema Validation**: Use a JSON schema validator (if available) or a simple `jsonlint` to ensure `package.json` syntax is correct.
- **Script Execution Test**: Attempt to run the new/modified scripts (e.g., `bun test`, `bun run type-check`, `bun run build`) to ensure they execute correctly without errors.
- **Dependency Check**: Confirm that `node_modules` contains the newly added TypeScript-related packages.

#### Step 3.2: Final Cleanup

I will perform a final cleanup of the project, which includes removing original JavaScript files (only after successful TypeScript conversion and verification), deleting any temporary migration files, and ensuring that the project structure is clean and optimized for TypeScript and Bun development.

```bash
# Example cleanup commands
rm path/to/original_js_file.js # Only if .ts conversion is fully verified
rm fileslist.md
rm fileslist.test.md
# etc.
```

**Success Criteria for Step 3.2:**
- ✅ All original JavaScript source files that have been successfully converted to TypeScript are removed.
- ✅ All temporary migration-related files (e.g., `fileslist.md`, `fileslist.test.md`, intermediate logs) are deleted.
- ✅ The project directory is clean, with no redundant or legacy files.
- ✅ The final project structure is optimized for TypeScript and Bun.

**Validation Methods for Step 3.2:**
- **File System Scan**: Conduct a recursive scan to ensure no `.js` files (corresponding to converted `.ts` files) remain in the source directories.
- **Temporary File Check**: Verify the absence of all temporary migration files.
- **Directory Listing Review**: Visually inspect the project directory for any unexpected or unnecessary files.
- **Build/Test Re-run**: Perform a full build and test run after cleanup to ensure no critical files were accidentally removed and the project still functions correctly.