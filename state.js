module.exports = {
	"Sublime Text": (state, group) => {
		let regex = /C:\\Users\\Alexander\\Documents\\GitHub\\(.*)\\(.*) \((.*)\)/

		if (regex.test(state)) {
			// We're working on one of my projects...
			let matches = state.match(regex)
			return [`${matches[1]}: ${matches[2]}`, group]
		} else {
			// We're working on some other project?
			return [state, group]
		}
	},
	"Google Chrome": (state, group) => {
		if (/(.*) \| Hacker News/.test(state)) {
			return ["Hacker News", "Programming"]
		}
		if (/(.*) \- Stack Overflow/.test(state)) {
			return ["Stack Overflow", "Programming"]
		}
		if (/reddit: the front page of the internet| : WritingPrompts/.test(state)) {
			return ["Reddit", "Relaxing"]
		}
		if (/^Imgur: The most | - Album on Imgur| - Imgur/.test(state)) {
			return ["Imgur", "Relaxing"]
		}
		if (/ \| MDN/.test(state)) {
			return ["Mozilla Developer Network", "Programming"]
		}
		if (/Classy Wolves/.test(state)) {
			return ["CLWO Forums", "Communication"]
		}
		return [state, group]
	},
	"CS:GO": (state, group) => {
		return ["CS:GO", "Relaxing"]
	}
}