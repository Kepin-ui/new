const {SlashCommandBuilder, EmbedBuilder, ChannelType} = require("discord.js");
const {connection} = require("../../db");
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("serviceinfo")
    .setDescription("SERVICE INFOMATION")

    .addStringOption(option => 
        option.setName("invoice")
        .setDescription("Invoice")
        .setRequired(true)
        )
    .addStringOption(option => 
        option.setName("ip")
        .setDescription("IP")
        .setRequired(true)
        ),
    
    async execute(interaction, client) {
        const {options} = interaction;

        const invoice = options.getString("invoice");
        const ip = options.getString("ip");

        try {
            const dblog = `SELECT invoice.invoice, invoice.produk, invoice.harga, invoice.penjual, invoice.pembeli, invoice.tanggal, service.ip, service.username, service.expired FROM ${config.invotable}, ${config.servtable} WHERE invoice.invoice = '${invoice}' AND service.ip = '${ip}';`
            connection.query(`SELECT invoice.invoice, invoice.produk, invoice.harga, invoice.penjual, invoice.pembeli, invoice.tanggal, service.ip, service.username, service.expired FROM ${config.invotable}, ${config.servtable} WHERE invoice.invoice = '${invoice}' AND service.ip = '${ip}';` , (err, connection) => {
                if (err) {
                    console.log(err)
                    interaction.reply({ content: `SOMETHING ERROR ${err}`, ephemeral: true })
                } else {
                    if (connection) {
                        var ip = connection[0].ip;
                        var produk = connection[0].produk;
                        var harga = connection[0].harga;
                        var invoice = connection[0].invoice;
                        var penjual = connection[0].penjual;
                        var pembeli = connection[0].pembeli;
                        var username = connection[0].username;
                        var tglpembelian = connection[0].tanggal
                        var tglexpired = connection[0].expired;

//                        interaction.reply({ content: `**SERVICE INFORMATION**\n**INVOICE [${invoice}]**\n*====================*\nPenjual: ${penjual}\nPembeli: ${pembeli}\nIP/HOST: ${ip}\nUsername: ${username}\nPassword: [Ask Seller]\nStatus: null\nExpired: ${expired}\n*====================*\n**INFORMASI SERVICE INI TIDAK DAPAT DILIHAT OLEH ORANG LAIN**`});
                        const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("SERVICE INFORMATION")
                        .setDescription(`**INVOICE [${invoice}]**\n*====================*\nProduk: ${produk}\nHarga: ${harga}\nPenjual: ${penjual}\nPembeli: ${pembeli}\nIP/HOST: ${ip}\nUsername: ${username}\nPassword: [Ask Seller]\nStatus: null\nTanggal Pembelian: ${tglpembelian}Tanggal Expired: ${tglexpired}\n*====================*\n**INFORMASI SERVICE INI TIDAK DAPAT DILIHAT OLEH ORANG LAIN**`)
                        interaction.reply({
                            embeds: [embed]
                        , ephemeral: true}); 

                        const logEmbed = new EmbedBuilder()
                        .setTitle("Command Log")
                        .setDescription("/serviceinfo\n**Output: Select Database** \n\n ```" + dblog + "```")
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
