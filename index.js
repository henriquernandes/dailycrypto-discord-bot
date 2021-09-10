const dotenv = require("dotenv");
const fetch = require("node-fetch");
const { Client, Intents, MessageEmbed } = require("discord.js");
dotenv.config();

let currency = ["usd", "brl"];
let current = 0;
let reply = "";
let dolarUpdated = "";
let result;
let dolar = 0;
let real = 0;

//Get crypto price via Gecko API
async function priceJSON(z) {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + currency[current] + '&symbols=' + z
  ).catch((err) => {console.log("API call error:", err.message);});
  if(response != '' && response != undefined) {
	const price = await response.json();
	result = price[0]
	console.log(price[0])
	return price[0].symbol;
  }
}

async function getDolar() {
  while (current < 1) {
    let response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=" +
        currency[current] +
        "&ids=polychain-monsters"
    ).catch((err) => {
      console.log("API call error:", err.message);
    });
    let price = await response.json();
    dolar = price[0].current_price;
    current++;
  }
  let response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=" +
      currency[current] +
      "&ids=polychain-monsters"
  ).catch((err) => {
    console.log("API call error:", err.message);
  });
  let price = await response.json();
  real = price[0].current_price;
  let result = real / dolar;
  dolarUpdated = "R$ " + result.toFixed("2");
  current = 0;
  return dolarUpdated;
}

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  if (message.content === "comando") {
    message.reply({
      content:
        "Comandos disponiveis para consulta de valores: " + coins,
    });
  }
  if (message.content == await priceJSON(message.content)) {
    message.reply({
      content: 'U$ ' + result.current_price + ' for ' + result.name
    });
  }
  if (message.content === "!change dolar") {
    current = 1
    message.reply({
      content: 'Currency updated'
    });
  }
  if (message.content === "!change real") {
    current = 0
    message.reply({
      content: 'Currency updated'
    });
  }
  if (message.content === "dolar") {
    dolarUpdated = await getDolar();
    message.reply({
      content: dolarUpdated,
    });
  }
  if (message.content === "pizza") {
    message.reply({
      content:
        "https://i.pinimg.com/originals/36/ce/79/36ce7968e79e2af080a13e8f20895e97.jpg",
    });
  }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
