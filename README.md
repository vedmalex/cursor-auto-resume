# Cursor Auto Resume

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)

A simple tool that automatically clicks the "resume the conversation" link when Cursor IDE hits its API rate limits.

## Important Note on Usage

This tool is created with the intention of helping developers maintain their workflow efficiency while using Cursor IDE. It is designed to automate a manual action that Cursor explicitly allows (clicking the "resume conversation" link) and does not attempt to bypass or circumvent any actual rate limits or security measures.

We respect Cursor's services and their need for rate limiting. This tool:
- Only automates an action that users are explicitly allowed to perform
- Maintains the same cooldown periods as manual clicking
- Does not attempt to bypass actual API limits or quotas
- Simply reduces the manual interruption of having to click the resume link

The goal is to enhance developer productivity while working within Cursor's intended usage patterns.

## Why This Tool Exists

When using Cursor's AI features extensively during development, you often hit rate limits after about 25 tool calls. Normally, you'd see a message like this:

```
Note: we default stop the agent after 25 tool calls. You can resume the conversation.
```

This tool automatically detects this message and clicks the "resume the conversation" link for you, allowing you to maintain focus on your development tasks without manual interruption.

## Features

- **Auto-click**: Automatically clicks the "resume the conversation" link when rate limits appear.
- **Enhanced Error Handling**: Automatically detects and attempts to resolve various connection and rate limit errors, including pop-up messages.
- **Progressive Retry**: Implements a progressive backoff timer for repeated errors.
- **Interactive UI Indicator**: An on-screen, draggable, and collapsible indicator with controls (Stop, Resume, Exit).
- **Customizable Auto-stop**: Allows users to set the script's auto-stop duration.

## Recent Enhancements

This version introduces significant improvements to the script's robustness, user control, and overall usability:

### Enhanced Error Handling & Progressive Backoff:
- Modified error detection to globally search for error popups (e.g., "We're having trouble connecting to the model provider", "Too many requests") across the entire document, not just within the chat window.
- Implemented a progressive retry timer (5s, 10s, 20s, 45s, 60s delays) for repeated error detections with the same message, to prevent aggressive retries.
- Added comprehensive console logs for various error detection and click scenarios.

### Interactive UI Indicator with Control Buttons:
- Integrated "Остановить" (Stop), "Продолжить" (Resume), and "Выйти" (Exit) buttons directly onto the on-screen indicator for manual control of the script.
- "Остановить" pauses automatic clicks.
- "Продолжить" resets the timer and resumes clicks.
- "Выйти" stops the script and removes the indicator.

### Customizable Auto-Stop Duration:
- Added a dropdown menu to the indicator allowing users to select the script's auto-stop duration (1, 5, 10, 15, 20, 30, 45, 60 minutes).
- Selecting a new duration immediately updates the `maxDuration` and resets the timer.

### Draggable and Collapsible Indicator:
- Made the on-screen indicator draggable, allowing users to reposition it anywhere on the screen.
- Added a "Свернуть" / "Развернуть" button to collapse the indicator into a compact strip and expand it back to full view.
- Adjusted positioning logic from `right` to dynamic `left` calculation to ensure proper dragging behavior and prevent unintended expansion.

### Refined Element Selectors:
- Updated `chatWindow` selector to `div.full-input-box` for improved reliability.
- Adjusted `toolLimitXpath` to target `<section>` elements containing relevant text within `data-markdown-raw` attributes.

These changes significantly improve the script's robustness, user control, and overall usability within the Cursor/VS Code environment.

## How to Use

Permanent installation:

1. Install [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css)
2. Clone this repo to your home directory
3. Add this to your `settings.json`:

```json
"vscode_custom_css.imports": [
    "file://${userHome}/cursor-auto-resume/cursor-auto-resume.js"
]
```

4. Restart Cursor with proper permissions to modify itself (your user should own it)
5. Activate command "Reload Custom CSS and JS"
6. Reload window

Step 5 + 6 must be repeated on each Cursor update.

One time installation:

1. In Cursor, click "Help" in the menu bar and select "Toggle Developer Tools"
2. Click the "Console" tab
3. Copy the entire code from [cursor-auto-resume.js](cursor-auto-resume.js)
4. Paste it into the console and press Enter
5. Close DevTools by clicking the X in the corner (optional)

Once the script is running, a draggable and collapsible indicator will appear in the top-right corner of your screen, allowing you to monitor and control the script's behavior.

## How It Works

The script:

1. Monitors the page for specific rate limit and error messages.
2. When found, looks for the exact "resume the conversation" link or relevant error button (e.g., "Resume", "Try again").
3. Clicks the link/button automatically (with a progressive cooldown for errors).
4. Provides an interactive UI for monitoring and control.

## FAQ

### Is this safe to use?
Yes, the script only runs in your Cursor IDE and only clicks the specific "resume the conversation" link when rate limits are hit. It doesn't modify any core functionality or bypass any security measures.

### Will this work with future versions of Cursor?
As long as Cursor continues to use similar rate limit messages and "resume the conversation" links, the script should continue to work. If Cursor's interface changes, we'll update the tool to maintain compatibility while respecting their service.

### How do I disable it?
Close and reopen Cursor IDE, or refresh the window.

### Does this bypass Cursor's rate limits?
No. This tool only automates clicking the "resume the conversation" link that Cursor explicitly provides. It respects all cooldown periods and doesn't bypass any actual API limits. It simply automates an action that users are already permitted to perform manually.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request. When contributing, please maintain the tool's core principle of respecting Cursor's service while helping developers be more productive.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request