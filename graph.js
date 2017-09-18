const express = require('express')
const randomColor = require('randomcolor')
const app = express()
const body_parser = require('body-parser')

let group_count_labels = []
let group_count_values = []
let program_count_labels = []
let program_count_values = []

app.set('view engine', 'pug')
app.use(body_parser.json())
app.use(express.static('public'))

function gen(labels, values) {
	let relaxing_percentage = 0
	let time_int = values.reduce((acc, val) => acc + val)
	console.log(time_int)
	let time = `${ ("00" + Math.floor(time_int / 3600)).substr(-2, 2) }:${ ("00" + Math.floor(time_int % 3600 / 60)).substr(-2, 2) }`
	let graph = []
	for (let index in labels) {
		if (labels[index] == "Relaxing") {
			relaxing_percentage = values[index] / time_int * 100
		}
		if (index == 10) break
		graph.push({
			title: labels[index],
			value: Math.floor(values[index] / 60),
			color: randomColor(),
		})
	}
	return { data: graph, programs: labels.length, time, relaxing_percentage }
}

app.post('/update_group_counts', function (req, res) {
  console.log(req.body)
  group_count_labels = req.body.map((item) => item[0])
  group_count_values = req.body.map((item) => item[1])
})

app.post('/update_program_counts', function (req, res) {
  program_count_labels = req.body.map((item) => item[0])
  program_count_values = req.body.map((item) => item[1])
})

app.get('/graph_group', function (req, res) {
	res.render('graph', { graph: 'group' })
})

app.get('/graph_program', function (req, res) {
	res.render('graph', { graph: 'program' })
})

app.get('/group', function (req, res) {
	res.json(gen(group_count_labels, group_count_values))
})

app.get('/program', function (req, res) {
	res.json(gen(program_count_labels, program_count_values))
})

app.get('/', function (req, res) {
  res.render('index')
})

app.listen(8093, function () {
  console.log('Example app listening on port 8093!')
})