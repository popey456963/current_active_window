const fs = require('fs')
const os = require('os')
const hjson = require('hjson')
const Influx = require('influx')
const monitor = require('active-window')
const state_changer = require('C:\\Users\\Alexander\\Documents\\GitHub\\current_active_window\\state.js')
const groups = hjson.parse(fs.readFileSync('C:\\Users\\Alexander\\Documents\\GitHub\\current_active_window\\groups.hjson', { encoding: 'utf8' }))

const influx = new Influx.InfluxDB({
 host: 'localhost',
 database: 'active_windows',
 schema: [
   {
     measurement: 'active_window',
     fields: {
       program: Influx.FieldType.STRING,
       state: Influx.FieldType.STRING,
       group: Influx.FieldType.STRING
     },
     tags: [
       'host'
     ]
   }
 ]
})

let program_groups = {}

for (let group in groups) {
	for (let program in groups[group]) {
		program_groups[program] = group
	}
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function callback(window){
	let title = window.title.split('-')
	let program = ""
	let state = ""
	let group = "Unknown"

	if (title.length > 1) {
		program = title[title.length - 1]
		title.pop()
		state = title.join('-')
	} else {
		program = window.app
		state = window.title
	}

	program = toTitleCase(program.replace(/_/g, ' ').trim())
	state = state.trim()

	if (program in program_groups) {
		group = program_groups[program]
		program = groups[program_groups[program]][program]
	}

	if (program in state_changer) {
		;([state, group] = state_changer[program](state, group))
	}

	influx.writePoints([
	  {
	    measurement: 'active_window',
	    tags: { host: os.hostname() },
	    fields: { program, state, group }
	  }
	])

	console.log({ program, state, group })
}

monitor.getActiveWindow(callback, -1, 1)