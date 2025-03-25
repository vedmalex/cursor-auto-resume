# Cursor Auto Resume

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)

A simple tool that automatically clicks the "resume the conversation" link when Cursor IDE hits its API rate limits.

## Why This Tool Exists

When using Cursor's AI features extensively, you often hit rate limits after about 25 tool calls. Normally, you'd see a message like this:

```
Note: we default stop the agent after 25 tool calls. You can resume the conversation.
```

This tool automatically detects this message and clicks the "resume the conversation" link for you, so you can keep working without interruption.

## Features

- **Auto-click**: Automatically clicks the "resume the conversation" link when rate limits appear
- **Anti-spam**: 3-second cooldown between clicks to prevent issues

## How to Use

1. In Cursor, click "Help" in the menu bar and select "Toggle Developer Tools"
2. Click the "Console" tab
3. Copy the entire code from [cursor-auto-resume.js](cursor-auto-resume.js)
4. Paste it into the console and press Enter
5. Close DevTools by clicking the X in the corner (optional)

The script will now automatically click the "resume the conversation" link whenever it appears.

## How It Works

The script:

1. Monitors the page for specific rate limit messages
2. When found, looks for the exact "resume the conversation" link
3. Clicks the link automatically (with a 3-second cooldown)

## FAQ

### Is this safe to use?
Yes, the script only runs in your Cursor IDE and only clicks the specific "resume the conversation" link when rate limits are hit.

### Will this work with future versions of Cursor?
As long as Cursor continues to use similar rate limit messages and "resume the conversation" links, the script should continue to work.

### How do I disable it?
Close and reopen Cursor IDE, or refresh the window.

### Does this bypass Cursor's rate limits?
No, it simply automates clicking the "resume the conversation" link that Cursor provides when you hit a rate limit.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 