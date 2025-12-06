// Unfollow everyone on X (Formerly Twitter) - Safe Version
// Modified for: Longer delays + Max 200 accounts limit
//
// 1. Go to https://twitter.com/YOUR_USER_NAME/following
// 2. Open the Developer Console. (COMMAND+ALT+I on Mac)
// 3. Paste this into the Developer Console and run it
//
// Modified: Added safety delays and 200 account limit

(() => {
  const $followButtons = '[data-testid$="-unfollow"]';
  const $confirmButton = '[data-testid="confirmationSheetConfirm"]';
  const MAX_UNFOLLOWS = 200; // Maximum accounts to unfollow per session
  const MIN_DELAY = 5; // Minimum delay in seconds
  const MAX_DELAY = 8; // Maximum delay in seconds
  const BATCH_DELAY = 4; // Delay between batches in seconds
  
  let unfollowCount = 0;
  
  const retry = {
    count: 0,
    limit: 3,
  };
  
  const scrollToTheBottom = () => window.scrollTo(0, document.body.scrollHeight);
  const retryLimitReached = () => retry.count === retry.limit;
  const addNewRetry = () => retry.count++;
  
  // Generate random delay between MIN_DELAY and MAX_DELAY
  const getRandomDelay = () => {
    return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
  };
  
  const sleep = ({ seconds }) =>
    new Promise((proceed) => {
      console.log(`⏳ WAITING FOR ${seconds} SECONDS...`);
      setTimeout(proceed, seconds * 1000);
    });
  
  const hasBlueCheckmark = (button) => {
    // Look for verified badge (blue checkmark) near the follow button
    const userCard = button.closest('[data-testid="UserCell"]') || button.closest('article') || button.parentElement?.parentElement;
    if (!userCard) return false;
    
    // Check for various verified indicators
    const verifiedBadge = userCard.querySelector('[data-testid="icon-verified"], [data-testid="icon-verified-deprecated"], svg[aria-label*="Verified"], svg[aria-label*="verified"]');
    return !!verifiedBadge;
  };
  
  const unfollowAll = async (followButtons) => {
    console.log(`🔄 UNFOLLOWING ${followButtons.length} USERS (Total: ${unfollowCount}/${MAX_UNFOLLOWS})...`);
    
    for (const followButton of followButtons) {
      // Check if max limit reached
      if (unfollowCount >= MAX_UNFOLLOWS) {
        console.log(`⚠️ REACHED MAXIMUM LIMIT OF ${MAX_UNFOLLOWS} UNFOLLOWS!`);
        console.log(`✅ STOPPING SCRIPT TO MAINTAIN ACCOUNT SAFETY`);
        return false; // Return false to stop the process
      }
      
      // Skip verified accounts with blue checkmark
      if (hasBlueCheckmark(followButton)) {
        console.log(`✅ SKIPPED verified account (blue checkmark)`);
        continue;
      }
      
      if (followButton) {
        const randomDelay = getRandomDelay();
        followButton.click();
        console.log(`👤 Unfollowing account ${unfollowCount + 1}... (${randomDelay}s delay)`);
        unfollowCount++;
        
        await sleep({ seconds: randomDelay });
        
        const confirmButton = document.querySelector($confirmButton);
        if (confirmButton) {
          confirmButton.click();
        }
        
        await sleep({ seconds: 1 });
      }
    }
    
    return true; // Continue processing
  };
  
  const nextBatch = async () => {
    // Stop if max limit reached
    if (unfollowCount >= MAX_UNFOLLOWS) {
      console.log(`✅ PROCESS COMPLETED: ${unfollowCount} ACCOUNTS UNFOLLOWED`);
      console.log(`⏸️ MAXIMUM LIMIT (${MAX_UNFOLLOWS}) REACHED`);
      return;
    }
    
    scrollToTheBottom();
    await sleep({ seconds: BATCH_DELAY });
    
    let followButtons = Array.from(document.querySelectorAll($followButtons));
    followButtons = followButtons.filter(b => 
      b.parentElement?.parentElement?.querySelector('[data-testid="userFollowIndicator"]') === null
    );
    
    const followButtonsWereFound = followButtons.length > 0;
    
    if (followButtonsWereFound) {
      const shouldContinue = await unfollowAll(followButtons);
      
      if (!shouldContinue) {
        return; // Stop if max limit reached
      }
      
      await sleep({ seconds: BATCH_DELAY });
      return nextBatch();
    } else {
      addNewRetry();
    }
    
    if (retryLimitReached()) {
      console.log(`✅ NO ACCOUNTS FOUND, PROCESS COMPLETED`);
      console.log(`📊 TOTAL UNFOLLOWED: ${unfollowCount} ACCOUNTS`);
      console.log(`🔄 RELOAD PAGE AND RE-RUN SCRIPT IF ANY WERE MISSED`);
    } else {
      console.log(`🔁 RETRY ATTEMPT ${retry.count}/${retry.limit}`);
      await sleep({ seconds: BATCH_DELAY });
      return nextBatch();
    }
  };
  
  console.log(`🚀 STARTING UNFOLLOW PROCESS...`);
  console.log(`⏱️ RANDOM DELAY: ${MIN_DELAY}-${MAX_DELAY} seconds per account`);
  console.log(`📈 MAXIMUM LIMIT: ${MAX_UNFOLLOWS} accounts`);
  console.log(`✅ WILL SKIP accounts with blue checkmark (verified)`);
  console.log(`⚠️ This is a SAFE version with random delays`);
  
  nextBatch();
})();
