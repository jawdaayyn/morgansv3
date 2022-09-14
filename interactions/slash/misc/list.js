/**
 * @file Sample help command with slash command.
 * @author Naman Vrati & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");
const { supabase_key, supabase_url } = require("../../../config.json");

const supabase = createClient(supabase_url, supabase_key);

const getList = async () => {
	const { data } = await supabase.from("players").select();
	if (data.length === 0) {
		console.log("cc");
		return 0;
	}
	return data;
};
/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("liste")
		.setDescription("Afficher les joueurs actuellement enregistrés."),
	async execute(interaction) {
		const liste = await getList();

		const listEmbed = new EmbedBuilder();

		listEmbed.setTitle("Liste des joueurs");
		listEmbed.setDescription("Afficher la liste des joueurs");
		listEmbed.setThumbnail(
			"https://vl-media.fr/wp-content/uploads/2019/11/league-of-legends_logo.png"
		);
		listEmbed.setColor("Random");
		listEmbed.setTimestamp();
		listEmbed.setFooter({
			text: "cc c'est en bas ça",
			iconURL:
				"https://www.connectesport.com/wp-content/uploads/2015/09/BASE_LCS_Logo_RGB_72dpi.png",
		});
		if (liste === 0) {
			listEmbed.addFields({
				name: "Erreur",
				value:
					"Il n'y a aucun joueur inscrit dans le tableau, ajoutez en avec /addplayer",
			});
		} else {
			listEmbed.addFields({
				name: "joueurs",
				value: liste
					.map((player) => `${player.name} : ${player.account}`)
					.join("\n"),
			});
		}

		// Replies to the interaction!

		await interaction.reply({
			embeds: [listEmbed],
		});
	},
};
