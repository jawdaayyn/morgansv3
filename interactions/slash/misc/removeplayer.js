const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const removeUser = async (id, username) => {
	const { error } = await supabase
		.from("players")
		.delete()
		.match({ discord_id: id });
	if (error) {
		return error;
	} else {
		return `Le compte ${username} a bien été supprimé`;
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("removeplayer")
		.setDescription("Supprimer un joueur de league de la base de données")
		.addUserOption((option) =>
			option
				.setRequired(true)
				.setName("user")
				.setDescription("L'utilisateur que vous souhaitez supprimer")
		),

	async execute(interaction) {
		let user = interaction.options.getUser("user");

		const Embed = new EmbedBuilder();
		const data = await removeUser(user.id, user.username);

		Embed.setTitle("Suppression de l'utilisateur");
		Embed.setFooter({ text: `${user.username} | ${user.id}` });

		if (data != `Le compte ${user.username} a bien été supprimé`) {
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
