# 🚀 Twitter Smart Unfollow

A sophisticated, browser-based automation tool for intelligently unfollowing Twitter/X accounts based on follower count filters. Designed with safety, reliability, and efficiency in mind.

## ✨ Features

- **Intelligent Filtering** - Automatically filter accounts by follower count threshold
- **Real-time Profile Verification** - Opens each profile to verify follower count accuracy
- **Floating Control Panel** - Modern UI with real-time statistics and progress tracking
- **Pause & Resume** - Full control over the automation process
- **Customizable Settings** - Adjust unfollows target, follower threshold, and delay intervals
- **Smart Delays** - Random delays between actions to avoid detection (20-35 seconds)
- **Detailed Logging** - Comprehensive console logging for monitoring and debugging
- **Mutual Follow Detection** - Automatically skips accounts that follow you back
- **No API Keys Required** - Works directly through browser automation

## 📊 Statistics Panel

The floating panel displays real-time metrics:

- **Unfollowed** - Number of successfully unfollowed accounts
- **Filtered** - Accounts skipped due to follower count threshold
- **Skipped** - Accounts skipped due to other conditions (mutual, errors, etc.)
- **Goal** - Target number of unfollows
- **Progress Bar** - Visual representation of completion percentage

## 🎯 How It Works

1. **Opens** each following profile in a background tab
2. **Reads** the follower count from the profile
3. **Compares** against your minimum follower threshold
4. **Unfollow** if below threshold, or **Skip** if above
5. **Implements** smart delays between actions

## 🚀 Installation & Usage

### Method 1: Console (Recommended)

1. Log in to Twitter/X
2. Navigate to your Following page: `https://x.com/username/following`
3. Open DevTools: Press `F12`
4. Go to **Console** tab
5. Type: `allow pasting`
6. Copy-paste the entire script
7. Press `Enter`

### Method 2: Browser Bookmark

1. Create a new bookmark in your browser
2. Replace the URL with the script (bookmarklet)
3. Click the bookmark while on your Following page

## ⚙️ Configuration

Adjust these settings in the floating panel:

| Setting | Default | Description |
|---------|---------|-------------|
| Max Unfollows | 100 | Maximum number of accounts to unfollow |
| Max Followers | 10,000 | Only unfollow accounts with followers below this |
| Min Delay | 20s | Minimum wait time between actions |
| Max Delay | 35s | Maximum wait time between actions |

## 🔒 Safety Features

- **Rate Limiting** - Smart delays prevent bot detection
- **Manual Control** - Pause and stop buttons for full control
- **Mutual Follow Detection** - Never unfollows accounts that follow you back
- **Error Handling** - Graceful error recovery
- **No API Required** - Avoids API rate limits and authentication issues

## 📋 Console Output

Real-time logging shows:

```
📊 @username: 5,432 followers
✅ UNFOLLOWED @username
🔵 SKIP @username (426,400 >= 10,000)
⏳ Waiting 28s...
❌ Error: Connection timeout
```

## ⚠️ Disclaimer

- This tool is for educational purposes only
- Use responsibly and at your own risk
- Twitter/X may suspend accounts for excessive automation
- Not affiliated with Twitter/X, Inc.
- Always comply with Twitter/X Terms of Service

## 🔍 Technical Details

- **Language:** JavaScript (ES6+)
- **Platform:** Browser-based (Chrome, Firefox, Edge, Safari)
- **Method:** DOM manipulation + window automation
- **Security:** No data transmission, runs locally only
- **Performance:** Optimized for reliability over speed

## 📈 Statistics

Upon completion, the script displays:
- Total accounts unfollowed
- Total accounts filtered
- Total accounts skipped
- Detailed action log

## 🛠️ Troubleshooting

### Script won't paste in console
- Type `allow pasting` first
- Refresh the page and try again

### Followers count not detected
- Wait for profile to fully load (3 seconds)
- Check if followers info is visible on profile

### Unfollow not working
- Confirm button may be delayed - increase delay in settings
- Check if account is already unfollowed

### Getting rate limited
- Increase Min/Max Delay values
- Reduce Max Unfollows target
- Wait a few hours before running again

## 📝 License

This project is provided as-is for educational purposes.

## 🤝 Contributing

Suggestions and improvements are welcome! Feel free to fork and submit pull requests.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Status:** Active & Maintained

⭐ If you find this useful, please consider giving it a star!
