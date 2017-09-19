const fs = require('fs')
const os = require('os')
const hjson = require('hjson')
const Influx = require('influx')
const request = require('request-promise')
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
     tags: [ 'host' ]
   }
 ]
})

setInterval(() => {
  influx.query(`SELECT * FROM "active_window"`).then(rows => {
    let group_counts = {}
    let program_counts = {}
    let unknown_programs = new Set()

    rows.forEach(row => {
      group_counts[row.group] = group_counts[row.group] + 1 || 1;
      program_counts[row.program] = program_counts[row.program] + 1 || 1;
      if (row.group == 'Unknown') {
        unknown_programs.add(row.program)
      }
    })

    console.log(program_counts)

    let program_count = 0
    let program_counts_sorted = Object.keys(program_counts)
      .sort((a, b) => program_counts[b] - program_counts[a])
      .map(item => [item, program_counts[item]])
      //.filter(item => program_count++ < 10)

    let group_counts_sorted = Object.keys(group_counts)
      .sort((a, b) => group_counts[b] - group_counts[a])
      .map(item => [item, group_counts[item]])
      .filter(item => item[1] > 10)

    request({
      method: 'POST',
      uri: 'https://time.sinisterheavens.com/update_group_counts',
      body: group_counts_sorted,
      json: true
    })

    request({
      method: 'POST',
      uri: 'https://time.sinisterheavens.com/update_program_counts',
      body: program_counts_sorted,
      json: true
    })

    console.log(group_counts_sorted)
    console.log(program_counts_sorted)
    console.log(unknown_programs)
  })
}, 1000 * 60 * 30)