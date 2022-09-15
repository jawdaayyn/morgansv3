/**
 * @file Default Bot Mention Command
 * @author Naman Vrati
 * @since 3.0.0
 */

const dotenv = require("dotenv");
dotenv.config();
const PREFIX = process.env.PREFIX;
module.exports = {
	/**
	 * @description Executes when the bot is pinged.
	 * @author Naman Vrati
	 * @param {import('discord.js').Message} message The Message Object of the command.
	 */

	async execute(message) {
		return message.channel.send(
			`Hi ${message.author}! My prefix is \`${PREFIX}\`, get help by \`${PREFIX}help\``
		);
	},
};
