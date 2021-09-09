const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { Client, Intents, MessageEmbed } = require('discord.js');
dotenv.config();

let currency = ['usd', 'brl']
let current = 0
let reply = ''
let dolarUpdated = 0;
let dolar = 0
let real = 0
let coins = {
	'slp': 'smooth-love-potion',
	'btc': 'bitcoin',
	'pvu': 'plant-vs-undead-token',
	'pmon': 'polychain-monsters',
	'ccar': 'cryptocars'
}
 
//Get crypto price via Gecko API
async function priceJSON(z) {
		const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency='+ currency[current] +'&ids=' + coins[z]).catch((err) => {
		console.log('API call error:', err.message);
		});
		const price = await response.json();
		let result
		if(current == 0){
		 result = 'Current price: U$ ' + price[0].current_price + ' for ' + price[0].name
		}
		if(current == 1){
			result = 'Current price: R$ ' + price[0].current_price + ' for ' + price[0].name
		   }
		return result
}

async function getDolar() {
	while(current < 1){
		let response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency='+ currency[current] +'&ids=polychain-monsters').catch((err) => {
		console.log('API call error:', err.message);
		});
		let price = await response.json();
		dolar = price[0].current_price
		current++
	}	
	let response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency='+ currency[current] +'&ids=polychain-monsters').catch((err) => {
	console.log('API call error:', err.message);
	});
	let price = await response.json();
	real = price[0].current_price
	let result = real / dolar
	dolarUpdated = 'R$ ' + result.toFixed('2')
	current = 0
	return dolarUpdated
}
getDolar()
// Create a new client instance
const client = new Client({ 
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES
		] 
	});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', 	async (message) => {
	if(message.content === 'comandos'){
		message.reply({
			content: 'Comandos disponiveis para consulta de valores: slp pvu pmon ccar btc dolar'
		})
	}
	if(message.content === 'slp'){
		reply = await priceJSON(message.content) + '\n'
		current++
		reply += await priceJSON(message.content)
		current--
		message.reply({
			content: reply
		})
	}
	if(message.content === 'btc'){
		reply = await priceJSON(message.content) + '\n'
		current++
		reply += await priceJSON(message.content)
		current--
		message.reply({
			content: reply
		})
	}
	if(message.content === 'pvu'){
		reply = await priceJSON(message.content) + '\n'
		current++
		reply += await priceJSON(message.content)
		current--
		message.reply({
			content: reply
		})
	}
	if(message.content === 'pmon'){
		reply = await priceJSON(message.content) + '\n'
		current++
		reply += await priceJSON(message.content)
		current--
		message.reply({
			content: reply
		})
	}
	if(message.content === 'ccar'){
		reply = await priceJSON(message.content) + '\n'
		current++
		reply += await priceJSON(message.content)
		current--
		message.reply({
			content: reply
		})
	}
	if(message.content === 'dolar'){
		message.reply({
			content: dolarUpdated
		})
	}
	if(message.content === 'pizza'){
		message.reply({
			content: 'https://i.pinimg.com/originals/36/ce/79/36ce7968e79e2af080a13e8f20895e97.jpg'
		})
	}
})

// Login to Discord with your client's token
client.login(process.env.TOKEN);

