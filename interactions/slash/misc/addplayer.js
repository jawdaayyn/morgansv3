const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");
const {
	riot_key,
	supabase_key,
	supabase_url,
} = require("../../../config.json");
const { request } = require("undici");

const supabase = createClient(supabase_url, supabase_key);

async function getJSONResponse(body) {
	let fullBody = "";

	for await (const data of body) {
		fullBody += data.toString();
	}

	return JSON.parse(fullBody);
}
const riotRequest = async (username) => {
	const url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${riot_key}`;
	const response = await request(url);
	const { id } = await getJSONResponse(response.body);
	console.log(id, url);
	return id;
};

const createUser = async (id, username, account) => {
	const lol_id = await riotRequest(account);
	const { error } = await supabase
		.from("players")
		.insert([
			{ discord_id: id, name: username, account: account, lol_id: lol_id },
		]);
	if (error) {
		return error;
	} else {
		return `Le compte ${username} a bien été ajouté`;
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("addplayer")
		.setDescription("Ajouter un joueur de league à la base de données")
		.addUserOption((option) =>
			option
				.setRequired(true)
				.setName("user")
				.setDescription("L'utilisateur que vous souhaitez ajouter")
		)
		.addStringOption((option) =>
			option
				.setRequired(true)
				.setName("username")
				.setDescription("Son compte LOL à assigner")
		),

	async execute(interaction) {
		let user = interaction.options.getUser("user");
		let account = interaction.options.getString("username");

		const Embed = new EmbedBuilder();
		const data = await createUser(user.id, user.username, account);

		Embed.setTitle("Ajout de l'utilisateur");
		Embed.setFooter({ text: `${user} | ${account}` });

		if (data != `Le compte ${user.username} a bien été ajouté`) {
			Embed.setFields({ name: "Erreur", value: "erreur" });
			console.log(data);
			console.log(user);
		} else {
			console.log("validé");
			Embed.setFields({ name: "Validé", value: "Validé" });
		}

		await interaction.reply({
			embeds: [Embed],
		});
	},
};
