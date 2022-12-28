const {SlashCommandBuilder, EmbedBuilder, ChannelType} = require("discord.js");
const {connection} = require("../../db");
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("form")
    .setDescription("FORM")

    .addStringOption(option => 
        option.setName("name")
        .setDescription("Name")
        .setRequired(true)
        ),
    
    async execute(interaction, client) {
        const {options} = interaction;

        const name = options.getString("name");

        try {
            const dblog = `SELECT * FROM ${config.formtable} WHERE name = ${name}`
            connection.query(`SELECT * FROM ${config.formtable} WHERE name = '${name}'` , (err, connection) => {
                if (err) {
                    console.log(err)
                    interaction.reply({ content: `SOMETHING ERROR ${err}`, ephemeral: true })
                } else {
                    if (connection) {
                        var id = connection[0].id;
                        var color = connection[0].color;
                        var title = connection[0].title;
                        var description = connection[0].description;
                        var image = connection[0].image;

//                        interaction.reply({ content: `**SERVICE INFORMATION**\n**INVOICE [${invoice}]**\n*====================*\nPenjual: ${penjual}\nPembeli: ${pembeli}\nIP/HOST: ${ip}\nUsername: ${username}\nPassword: [Ask Seller]\nStatus: null\nExpired: ${expired}\n*====================*\n**INFORMASI SERVICE INI TIDAK DAPAT DILIHAT OLEH ORANG LAIN**`});
                        const embed = new EmbedBuilder()
                        .setColor(`${color}`)
                        .setTitle(`${title}`)
                        .setDescription(`${description}`)
                        .setImage(`${image}`)
                        .setFooter({ text: "ID:", value: `${id}`})
                        interaction.reply({
                            embeds: [embed]
                        }); 

                        const logEmbed = new EmbedBuilder()
                        .setTitle("Command Log")
                        .setDescription("/form\n**Output: Select Database** \n\n ```" + dblog + "```")
                        .setTimestamp()
                        .setFooter({text: "Logging System"})
                        client.channels.cache.get(config.log_channel).send({ embeds: [logEmbed] })
                    }
                }
            });
        } catch (err) {
            console.log(err)
        }

    }
}
