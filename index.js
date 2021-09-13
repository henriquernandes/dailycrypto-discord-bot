const fetch = require("node-fetch");
const { Client, Intents, MessageEmbed } = require("discord.js");
const keepAlive = require('./server.js');

const prefix = "!";
let currency = ["brl", "usd"];
let symbolCurr = ["R$ ", "U$ "];
let current = 0;
let reply = "";
let dolarUpdated = "";
let result;
let dolar = 0;
let real = 0;

//Get crypto price via Gecko API
async function priceJSON(z) {
  const getData = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=" +
      currency[current] +
      "&symbols=" +
      z
  )
    .then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("API Failed");
      }
    })
    .then((json) => {
      if (json[0] != "" && json[0] != undefined) {
        result = json[0];
        return json[0].symbol;
      }
    })
    .catch((err) => {
      result = err.message;
      console.log(err.message);
      return result;
    });
  return getData;
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
  console.log("All ready");
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLocaleLowerCase();

  if (command === "v") {
    if (!args.length) return;
    console.log(message.member.user.tag + ' requested ' + args[0] + ' ' +  (args[1] != undefined ? args[1] : ''));
    if (args[0] === "comandos") {
      return message.channel.send(
        "Comandos disponiveis utilizar prefixo !v + comando\n" +
          "Funciona com todas criptomoedas utilizando o prefixo das mesmas caso queria saber valor de certa quantidade adicionar quantidade após espaço" +
          "\nExemplo !v btc 5 ou apenas individual !v btc" +
          "\nPara trocar a moeda para dolar utilizar !v dolar e para voltar ao real !v real"
      );
    } else if (args[0] === "real") {
      current = 0;
      return message.channel.send("Currency update to " + symbolCurr[current]);
    } else if (args[0] === "dolar") {
      current = 1;
      return message.channel.send("Currency update to " + symbolCurr[current]);
    } else if (args[0] === "easter") {
      const pizzaEmbed = {
        color: "#FBFF00",
        title: "Pizzazona meio a meio",
        description: ":pizza:",
        image: {
          url: "https://i.pinimg.com/originals/36/ce/79/36ce7968e79e2af080a13e8f20895e97.jpg",
        },
      };
      message.channel.send({ embeds: [pizzaEmbed] });
    } else if (args[0] === "dolaragora") {
      await getDolar();
      message.reply({
        content: dolarUpdated,
      });
    } else if (await priceJSON(args[0])) {
      if (args[1] != "" && args[1] != undefined) {
        const res = {
          title: symbolCurr[current] + ((result.current_price * args[1]).toFixed(6)).toString(),
          color: "#FFF300",
          footer: {
            text: result.name,
            icon_url: result.image
          },
        };
        message.channel.send({
          embeds: [res]
        });
      } else if (result === "API Failed") {
        message.reply({
          content: "API Failed",
        });
      } else {
        const res = {
          title: symbolCurr[current] + result.current_price.toString(),
          color: "#FFF300",
          footer: {
            text: result.name,
            icon_url: result.image
          },
        };
        message.reply({
          embeds: [res]
        });
      }
    } else {
      message.reply({
        content: "Crypto not found or command invalid",
      });
    }
  }
});

// Login to Discord with your client's token
keepAlive();
client.login(process.env.TOKEN);
