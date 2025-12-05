/*
  X/Twitter Mass Unfollow - Simple & Reliable Version
  Opens profile in new tab to check followers count
*/

if (window.unfollowScriptRunning) {
  console.warn("⚠️ Script already running!");
  throw new Error("Script already active");
}
window.unfollowScriptRunning = true;

let MAX_UNFOLLOWS = 100;
let MIN_FOLLOWERS = 10000;
let MIN_DELAY = 20000;
let MAX_DELAY = 35000;
let isPaused = false;
let shouldStop = false;

function createUI() {
  const panel = document.createElement('div');
  panel.id = 'unfollow-panel';
  panel.innerHTML = `
    <style>
      #unfollow-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 340px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 20px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
        color: #fff;
      }
      #unfollow-panel * { box-sizing: border-box; }
      #unfollow-panel .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      #unfollow-panel .title {
        font-size: 16px;
        font-weight: 700;
        color: #1DA1F2;
      }
      #unfollow-panel .close-btn {
        background: rgba(255,255,255,0.1);
        border: none;
        color: #fff;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
      }
      #unfollow-panel .close-btn:hover { background: #e0245e; }
      #unfollow-panel .stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin-bottom: 16px;
      }
      #unfollow-panel .stat-box {
        background: rgba(255,255,255,0.05);
        border-radius: 10px;
        padding: 10px 6px;
        text-align: center;
      }
      #unfollow-panel .stat-value {
        font-size: 18px;
        font-weight: 700;
        color: #1DA1F2;
      }
      #unfollow-panel .stat-label {
        font-size: 9px;
        color: rgba(255,255,255,0.6);
        margin-top: 3px;
      }
      #unfollow-panel .progress-container {
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        height: 8px;
        overflow: hidden;
        margin-bottom: 12px;
      }
      #unfollow-panel .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #1DA1F2, #17bf63);
        width: 0%;
        transition: width 0.3s ease;
      }
      #unfollow-panel .progress-text {
        text-align: center;
        font-size: 11px;
        color: rgba(255,255,255,0.7);
        margin-bottom: 12px;
      }
      #unfollow-panel .current-user {
        background: rgba(29,161,242,0.1);
        border: 1px solid rgba(29,161,242,0.3);
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 16px;
        font-size: 12px;
        text-align: center;
        min-height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        word-break: break-word;
      }
      #unfollow-panel .setting-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        font-size: 11px;
      }
      #unfollow-panel .setting-input {
        width: 70px;
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.1);
        color: #fff;
        font-size: 11px;
        text-align: center;
      }
      #unfollow-panel .buttons {
        display: flex;
        gap: 10px;
        margin-top: 12px;
      }
      #unfollow-panel .btn {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      #unfollow-panel .btn-pause {
        background: #f7931a;
        color: #fff;
      }
      #unfollow-panel .btn-pause:hover { background: #e8820a; }
      #unfollow-panel .btn-stop {
        background: #e0245e;
        color: #fff;
      }
      #unfollow-panel .btn-stop:hover { background: #c91c52; }
      #unfollow-panel .status {
        text-align: center;
        padding: 8px;
        border-radius: 6px;
        font-size: 11px;
        margin-top: 12px;
        background: rgba(23,191,99,0.2);
        color: #17bf63;
      }
    </style>
    <div class="header">
      <div class="title">🚀 Smart Unfollow</div>
      <button class="close-btn" id="close-panel">×</button>
    </div>
    <div class="stats">
      <div class="stat-box">
        <div class="stat-value" id="stat-unfollowed">0</div>
        <div class="stat-label">Unfollowed</div>
      </div>
      <div class="stat-box">
        <div class="stat-value" id="stat-filtered">0</div>
        <div class="stat-label">Filtered</div>
      </div>
      <div class="stat-box">
        <div class="stat-value" id="stat-skipped">0</div>
        <div class="stat-label">Skipped</div>
      </div>
      <div class="stat-box">
        <div class="stat-value" id="stat-remaining">0</div>
        <div class="stat-label">Goal</div>
      </div>
    </div>
    <div class="progress-container">
      <div class="progress-bar" id="progress-bar"></div>
    </div>
    <div class="progress-text" id="progress-text">0%</div>
    <div class="current-user" id="current-user">⏳ Initializing...</div>
    <div class="setting-row">
      <span>Max Unfollows:</span>
      <input type="number" class="setting-input" id="setting-max" value="${MAX_UNFOLLOWS}" min="1">
    </div>
    <div class="setting-row">
      <span>Max Followers:</span>
      <input type="number" class="setting-input" id="setting-min-followers" value="${MIN_FOLLOWERS}" min="0">
    </div>
    <div class="buttons">
      <button class="btn btn-pause" id="btn-pause">⏸️ Pause</button>
      <button class="btn btn-stop" id="btn-stop">⏹️ Stop</button>
    </div>
    <div class="status" id="status-text">🟢 Running...</div>
  `;
  document.body.appendChild(panel);

  document.getElementById('close-panel').onclick = () => { shouldStop = true; panel.remove(); };
  document.getElementById('btn-pause').onclick = () => { 
    isPaused = !isPaused; 
    document.getElementById('btn-pause').innerHTML = isPaused ? '▶️ Resume' : '⏸️ Pause';
  };
  document.getElementById('btn-stop').onclick = () => { shouldStop = true; };
  document.getElementById('setting-max').onchange = (e) => { MAX_UNFOLLOWS = parseInt(e.target.value) || 100; };
  document.getElementById('setting-min-followers').onchange = (e) => { MIN_FOLLOWERS = parseInt(e.target.value) || 1000; };
}

function updateUI(unfollowed = 0, filtered = 0, skipped = 0, username = '') {
  const progress = MAX_UNFOLLOWS > 0 ? Math.round((unfollowed / MAX_UNFOLLOWS) * 100) : 0;
  document.getElementById('stat-unfollowed').textContent = unfollowed;
  document.getElementById('stat-filtered').textContent = filtered;
  document.getElementById('stat-skipped').textContent = skipped;
  document.getElementById('stat-remaining').textContent = MAX_UNFOLLOWS;
  document.getElementById('progress-bar').style.width = `${Math.min(progress, 100)}%`;
  document.getElementById('progress-text').textContent = `${Math.min(progress, 100)}%`;
  if (username) document.getElementById('current-user').innerHTML = `<strong>@${username}</strong>`;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function txt(el) { return (el?.innerText || el?.textContent || "").trim().toLowerCase(); }
function isMutual(cell) { return txt(cell).includes("follows you"); }
function getUsername(cell) {
  const link = cell.querySelector('a[href^="/"][role="link"]');
  return link ? link.getAttribute("href").split("/")[1] : "unknown";
}

function findUnfollowButton(cell) {
  const btns = cell.querySelectorAll('div[role="button"], button');
  return Array.from(btns).find(b => txt(b).includes("following") || txt(b).includes("unfollow"));
}

async function getFollowersFromProfile(username) {
  try {
    const tab = window.open(`https://x.com/${username}`, '_blank');
    if (!tab) return null;
    
    await sleep(3000); // Tunggu profile load
    
    try {
      const profileText = tab.document.body.innerText || '';
      
      // Match pattern untuk "X Followers" atau "X K Followers" atau "X.X K Followers"
      const match = profileText.match(/(\d+(?:,\d{3})*|\d+\.?\d*)\s*([KMB])\s+followers?/i);
      
      if (match) {
        let count = parseFloat(match[1].replace(/,/g, ''));
        const suffix = (match[2] || '').toUpperCase();
        
        console.log(`🔍 Parsed @${username}: ${match[1]} ${suffix} = ${count} before conversion`);
        
        if (suffix === 'K') count *= 1000;
        else if (suffix === 'M') count *= 1000000;
        else if (suffix === 'B') count *= 1000000000;
        
        const finalCount = Math.floor(count);
        console.log(`✔️ Final count for @${username}: ${finalCount.toLocaleString()}`);
        return finalCount;
      }
    } catch (e) {
      console.log(`Could not read from tab: ${e.message}`);
    }
    
    tab.close();
    return null;
  } catch (err) {
    console.log(`Error opening profile: ${err.message}`);
    return null;
  }
}

async function waitConfirm(timeout = 7000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const btn = document.querySelector('[data-testid="confirmationSheetConfirm"]') ||
                Array.from(document.querySelectorAll("button")).find(b => txt(b).includes("unfollow"));
    if (btn) return btn;
    await sleep(300);
  }
  return null;
}

(async function main() {
  createUI();
  console.log("%c🚀 Smart Unfollow Started", "color:#1DA1F2;font-weight:bold;");
  console.log(`📊 Filtering: followers < ${MIN_FOLLOWERS.toLocaleString()}`);

  const cells = document.querySelectorAll('[data-testid="UserCell"]');
  let unfollowed = 0, filtered = 0, skipped = 0;

  for (const cell of cells) {
    if (shouldStop || unfollowed >= MAX_UNFOLLOWS) break;
    while (isPaused && !shouldStop) await sleep(500);

    if (!cell.querySelector('a[href^="/"]') || isMutual(cell)) {
      skipped++;
      continue;
    }

    const username = getUsername(cell);
    const btn = findUnfollowButton(cell);
    if (!btn) { skipped++; continue; }

    updateUI(unfollowed, filtered, skipped, username);

    try {
      // Check followers
      const followers = await getFollowersFromProfile(username);
      
      if (followers !== null) {
        console.log(`📊 @${username}: ${followers.toLocaleString()} followers`);
        
        if (followers >= MIN_FOLLOWERS) {
          console.log(`🔵 SKIP @${username} (${followers.toLocaleString()} >= ${MIN_FOLLOWERS.toLocaleString()})`);
          filtered++;
          updateUI(unfollowed, filtered, skipped, username);
          continue; // SKIP - tanpa delay
        }
      }

      // Unfollow
      btn.scrollIntoView({ block: "center" });
      await sleep(500);
      btn.click();
      await sleep(800); // Tunggu dialog muncul

      const confirmBtn = await waitConfirm();
      if (confirmBtn) {
        confirmBtn.click();
        await sleep(1500); // Tunggu unfollow process selesai
        unfollowed++;
        console.log(`✅ UNFOLLOWED @${username}`);
        
        // DELAY hanya jika berhasil unfollow
        const delay = MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY));
        console.log(`⏳ Waiting ${Math.round(delay / 1000)}s...`);
        await sleep(delay);
      } else {
        console.log(`⚠️ No confirmation dialog for @${username}`);
      }

      updateUI(unfollowed, filtered, skipped, username);
    } catch (err) {
      console.error(`❌ Error @${username}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`%c✅ Done! Unfollowed: ${unfollowed} | Filtered: ${filtered} | Skipped: ${skipped}`, "color:#17bf63;font-weight:bold;");
  window.unfollowScriptRunning = false;
})();
