const winctl = require('winctl')
const Fuse = require('fuse.js')

var fuzzy_options = {
  shouldSort: true,
  tokenize: true,
  includeScore: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "title"
  ]
}

const win = winctl.GetActiveWindow()

// Output some information about the currently active window
console.log("Active Window Hwnd:", win.getHwnd())
console.log("Active Window Title:", win.getTitle())
console.log("Dimensions:", win.dimensions())

function findMatchingWindows() {
  return new Promise(function(resolve, reject) {
    winctl.FindWindows(win => win.isVisible() && win.getTitle()).then(windows => {
    	console.log("Visible windows:")
      let window_list = []
    	windows.sort((a,b) => a.getTitle().localeCompare(b.getTitle())).forEach(window => {
        window_list.push({ title: window.getTitle(), pid: window.getPid(), hwnd: window.getHwnd(), window })
        console.log(" - %s [pid=%d, hwnd=%d, parent=%d]", window.getTitle(), window.getPid(), window.getHwnd(), window.getParent())
      })
      resolve(new Fuse(window_list, fuzzy_options))
    })
  })
}

// Find matching sites, test against some result, show that window.
async function showWindow(matching) {
  let fuse = await findMatchingWindows()
  var result = fuse.search(matching)
  console.log("Showing...")
  console.log(result[0].item)
  result[0].item.window.showWindow(winctl.WindowStates.SHOWDEFAULT)
  console.log(result)
}

showWindow('Slack - clwo')

// Log when a new window opens or the active window changes
winctl.Events.addListener("active-window", function(now, prev) {
	console.log("Changed active window to: %s [prev=%s]", now.getTitle(), prev.getTitle());
});
