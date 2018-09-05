"use strict"
//this script loads the ASCII map and transforms it to something small/useful for the game

const fs = require('fs')



fs.readFileSync('map.txt', 'utf8', function(err, data){
	let map = [[]]
	if (err) throw err
	let enter = 0
	let exit = 0
	let flag = false
	let j = 0
	let column = 0
	for ( let i=0; i<data.length; i++){
		if ( data[i] === "\n" ){
			map[j].push(['\n'])
			j++
			map.push([])
			flag = false
			column = -1
		}
		else if ( data[i] !== ' ' && flag === false ){
			enter = column
			flag = true
			
		}
		else if ( data[i] === ' ' && flag === true ){
			exit = column
			map[j].push([enter,exit])
			flag = false
		}
		column++
	}
	fs.writeFileSync('planet.txt', map.toString())
})
