require('dotenv').config()

const Discord = require('discord.js')
const bot = new Discord.Client()

const GoogleSpreadsheet = require('google-spreadsheet')
const doc = new GoogleSpreadsheet('1D3m2R1TZxh8_5pbTz8SXNuKTDU9mUGZAxrvSjKEyjnI')

bot.on('ready', () => {
    console.log(`RUNNING: ${bot.user.tag}`)
    bot.user.setActivity("faire du PvE")
})

const nodeColors ={
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    reset: "\x1b[0m",
}
const rolesId = {
    //TODO : Changer pour les bons IDs de role
    admin: "696392106272358480", //test 2
    conseiller: "696392133145395271", //test 3
}
//Vérifié que la personne passé en paramètre ai un des rôles nécessaire
function isAuthorised(member){
    let roles = member.roles.cache
    return roles.has(rolesId.admin) || roles.has(rolesId.conseiller)
}
//Permet d'envoyer un message privé à la personne passé en paramètre
function sendPrivateMessage(member, message){
    member.createDM().then((DMChannel) => {
        DMChannel.send(message)
    })
}

//Listener quand un message est envoyé sur le serveur
bot.on('message', function (message) {
    if(message.author === bot.user) return
    //On vérifie que c'est une commande qui est tapé
    if(message.content.startsWith("!")){
        //On prépare les credantials de google
        const creds = {
            client_email: process.env.GOOGLE_EMAIL, 
            private_key: process.env.GOOGLE_TOKEN.replace(/\\n/g, '\n')
        }
        //On se connecte au document
        doc.useServiceAccountAuth(creds, function(err) {
            if(err) console.log(err)
            //On récupère les lignes du document
            doc.getRows(1, function(err, rows) {
                //On parcours toutes les lignes du document
                rows.forEach(function(row){
                    if(message.content === row.commande){
                        message.delete()
                        console.log(`LOG: '${nodeColors.green}${message.author.tag}${nodeColors.reset}' `
                                    + `attempt to use '${nodeColors.red}${message.content}${nodeColors.reset}' ` 
                                    + `in the channel '${nodeColors.blue}${message.channel.name}${nodeColors.reset}' ` 
                                    + `of the server '${nodeColors.blue}${message.channel.guild.name}${nodeColors.reset}'`)
                        //On regarde si l'utilisateur a le rang nécessaire
                        if(isAuthorised(message.member)){
                            //On regarde si le message doit etre un Embed ou non
                            if(row.embed === "TRUE"){
                                let messageEmbed = new Discord.MessageEmbed()
                                .setTitle(row.titre)
                                .setDescription(row.message)
                                //On regarde si l'image est une Miniature ou non
                                if(row.miniature == "TRUE"){
                                    messageEmbed.setThumbnail(row.image)
                                }else{
                                    messageEmbed.setImage(row.image)
                                }
                                return message.channel.send(messageEmbed)
                            }else{
                                return message.channel.send(row.message)
                            }   
                        }else{
                            sendPrivateMessage(message.member, `Tu n'as pas les droits nécessaire pour exécuter la commande \`${row.commande}\``)
                        }
                    }
                })
            })
        })
    }
})

//Listener quand quelqu'un rejoint le serveur
bot.on('guildMemberAdd', member => {
    //On lui envoit un message de bienvenue
    let messageEmbed = new Discord.MessageEmbed()
    .setTitle("Bienvenue sur le super Discord de DesastreShow !")
    sendPrivateMessage(member, messageEmbed)
})

bot.login(process.env.DISCORD_TOKEN)