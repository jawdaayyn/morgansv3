const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");
const { supabase_key, supabase_url } = require("../../../config.json");

const supabase = createClient(supabase_url, supabase_key);

async function getJSONResponse(body) {
	let fullBody = "";

	for await (const data of body) {
		fullBody += data.toString();
	}

	return JSON.parse(fullBody);
}

const getAccount = async (id) => {
	const { data, error } = await supabase
		.from("players")
		.select("account")
		.match({ discord_id: id });
	if (error) {
		return error;
	} else {
		console.log(data[0].account);
		return data[0].account;
	}
};

const displayMMR = async (account) => {
	let mmr = [];
	let url = `https://euw.whatismymmr.com/api/v1/summoner?name=${account}`;
	const response = await fetch(url).then((data) => data.json());
	if (response.error) {
		mmr.push(
			"Pas assez de parties en ranked",
			"Pas assez de parties en normal"
		);
		return mmr;
	} else {
		if (!response.ranked.closestRank && !response.normal.closestRank) {
			mmr.push(
				"Pas assez de parties en ranked",
				"Pas assez de parties en normal"
			);
			return mmr;
		} else if (!response.ranked.closestRank) {
			mmr.push("Pas assez de parties en ranked", response.normal.closestRank);
			return mmr;
		} else if (!response.normal.closestRank) {
			mmr.push(response.ranked.closestRank, "Pas assez de parties en normal");
			return mmr;
		} else {
			mmr.push(response.ranked.closestRank, response.normal.closestRank);
			return mmr;
		}
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mmr")
		.setDescription("Afficher le MMR d'un joueur")
		.addUserOption((option) =>
			option
				.setRequired(true)
				.setName("user")
				.setDescription("L'utilisateur que vous souhaitez supprimer")
		),

	async execute(interaction) {
		let user = interaction.options.getUser("user");
		const Embed = new EmbedBuilder();
		const account = await getAccount(user.id);
		const mmr = await displayMMR(account);
		Embed.setTitle(`MMR de ${user.username}`);
		Embed.setImage(user.displayAvatarURL());
		Embed.setColor("Random");
		Embed.setFooter({ text: `${user.username} | ${user.id}` });
		Embed.addFields({ name: "MMR Ranked SOLO/DUO :", value: mmr[0] });
		Embed.addFields({ name: "MMR Normal :", value: mmr[1] });

		await interaction.reply({
			embeds: [Embed],
		});
	},
};
