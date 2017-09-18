const express = require('express')
const app = express()
const body_parser = require('body-parser')

let group_count_labels = []
let group_count_values = []
let program_count_labels = []
let program_count_values = []

app.set('view engine', 'pug')
app.use(body_parser.json())
app.use(express.static('public'))

app.post('/update_group_counts', function (req, res) {
  console.log(req.body)
  group_count_labels = req.body.map((item) => item[0])
  group_count_values = req.body.map((item) => item[1])
})

app.post('/update_program_counts', function (req, res) {
  program_count_labels = req.body.map((item) => item[0])
  program_count_values = req.body.map((item) => item[1])
})

app.get('/', function (req, res) {
  res.render('index', { group_count_labels, group_count_values, program_count_labels, program_count_values })
})

app.listen(8093, function () {
  console.log('Example app listening on port 8093!')
})