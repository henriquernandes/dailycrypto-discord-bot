const dotenv = require("dotenv");
const fetch = require("node-fetch");
const { Client, Intents, MessageEmbed } = require("discord.js");
dotenv.config();

const prefix = '!'
let currency = ["brl", "usd"];
let symbolCurr = ['R$', 'U$']
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
	const price = await response.json();
  if(price != '' && price != undefined) {
	  result = price[0]
	  return price[0].symbol;
  }
}

async function getDolar() {
    let response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=polychain-monsters"
    ).catch((err) => {
      console.log("API call error:", err.message);
    });

    let price = await response.json();
    dolar = price[0].current_price;

    response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=polychain-monsters"
  ).catch((err) => {
    console.log("API call error:", err.message);
  });

  price = await response.json();
  real = price[0].current_price;
  let result = real / dolar;
  dolarUpdated = "R$ " + result.toFixed("2");
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
  if (message.content === "!v") {
    message.reply({
      content:
        "Comandos disponiveis para consulta de valores: " + coins,
    });
  }
  if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLocaleLowerCase()

    if (command === 'v') {
      if(!args.length) return
      else if(await priceJSON(args[0])) {
        if(args[1] != '' && args[1] != undefined){
          message.reply({
            content: symbolCurr[current] + ' ' + (result.current_price * args[1]).toFixed(6) + ' for ' + result.name
        });}
        else {
          message.reply({
            content: symbolCurr[current] + ' ' +  result.current_price + ' for ' + result.name
        });
      }
    }
    else if(args[0] === 'real'){
      current = 0
      return message.channel.send('Currency update to ' + symbolCurr[current])
    }
    else if(args[0] === 'dolar'){
      current = 1
      return message.channel.send('Currency update to ' + symbolCurr[current])
    }
    else if (args[0] === "easter") {
      const pizzaEmbed = {
      color: '#FBFF00',
      title: 'Pizzazona meio a meio',
      description:':pizza:',
      image: {
        url: 'https://i.pinimg.com/originals/36/ce/79/36ce7968e79e2af080a13e8f20895e97.jpg',
      }
    }
      message.channel.send({ embeds: [pizzaEmbed] });
    }
    else if(args[0] === 'dolaragora'){
      await getDolar()
      message.reply({
        content: dolarUpdated
    });
    }
    else{
      message.reply({
        content: 'Crypto not found or command invalid'
    });
    }
  }
  
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
