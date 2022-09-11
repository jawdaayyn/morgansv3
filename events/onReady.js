const { riot_key, supabase_key, supabase_url } = require("../config.json");
const { request } = require("undici");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(supabase_url, supabase_key);

async function getJSONResponse(body) {
	let fullBody = "";

	for await (const data of body) {
		fullBody += data.toString();
	}

	return JSON.parse(fullBody);
}

const findMatch = async () => {
	const url = `https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/aAPIEgE95b0_gB8n3RX6HTRyY8YfipIyoXC72K863FVovO9r?api_key=${riot_key}`;
	const response = await request(url);
	if (response.statusCode === 404) {
		console.log(response.statusCode);
		return response.statusCode;
	} else {
		return response;
	}
};

module.exports = {
	name: "ready",
	once: true,

	/**
	 * @description Executes when client is ready (bot initialization).
	 * @param {import('../typings').Client} client Main Application Client.
	 */
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		setInterval(async () => {
			findMatch();
		}, 5000);
	},
};
