require('dotenv').config()

const fs = require('fs')

const Discord = require('discord.js')
const bot = new Discord.Client()

const {GoogleSpreadsheet} = require('google-spreadsheet')
const doc = new GoogleSpreadsheet('1D3m2R1TZxh8_5pbTz8SXNuKTDU9mUGZAxrvSjKEyjnI')

bot.on('ready', async function(){
    console.log(`RUNNING: ${bot.user.tag}`)
    bot.user.setActivity("DesastreShow", {type: "WATCHING"})
    //Fetch sur le message ajoutant un role par reaction
    bot.channels.cache.get(channelsId.regles).messages.fetch(messagesId.roles)
    //On met a jour le salon Membres
    bot.channels.cache.get(channelsId.membres).edit({
        name: `Membres : ${bot.guilds.cache.get(guildsId.desastre).memberCount}`
    })
    const msg = await bot.channels.cache.get(channelsId.regles).messages.fetch(messagesId.roles)
    const embed = new Discord.MessageEmbed()
        .setTitle("VOS RÔLES")
        .setDescription("Pour avoir accès à tous les channels merci d'indiquer votre plateforme en réagissant à ce message :\n\n**PC** :orange_circle: │ **PS4** :blue_circle: │**XBOX** :green_circle:\n\nSi vous voulez suivre l'actualité des Ecostreams, vous pouvez obtenir le rôle <@&1003996572914286612> en cliquant sur le logo !")
        .setThumbnail("https://download.seaicons.com/icons/paomedia/small-n-flat/1024/gamepad-icon.png")
    msg.edit(embed)
    //On se connecte au GDoc
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_EMAIL, 
        private_key: process.env.GOOGLE_TOKEN.replace(/\\n/g, '\n')
    })
})

const nodeColors = {
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
    admin: "385850055426572298",
    modo: "426426746171293698",
    conseiller: "671356231415365642",
    helpeur: "706869753498697730",
    sub: "380413691339997194",

    pc: "428584658003820545",
    ps4: "428584774848872458",
    xbox: "428584720125919243",
    eco: "1003996572914286612",
}

const messagesId = {
    roles: "707955881677029446",
}

const guildsId = {
    desastre: "146004947870154752",
}

const channelsId = {
    regles: "489125908666515456",
    giveaway : "708625146432454707",
    membres: "811263189001437233",
}

const usersID = {
    desastre: "146003404840239104",
    floliroy: "112632359207108608",
}

//Vérifie que la personne passé en paramètre ai un des rôles nécessaire
function isAuthorised(member){
    let roles = member.roles.cache
    return roles.has(rolesId.admin) || roles.has(rolesId.modo) || roles.has(rolesId.conseiller) || roles.has(rolesId.helpeur) || roles.has(rolesId.sub)
}
//Permet d'envoyer un message privé à la personne passé en paramètre
function sendPrivateMessage(member, message){
    member.createDM().then(function(DMChannel){
        DMChannel.send(message)
    })
}

async function getMemberById(reaction, id){
    return await reaction.message.guild.members.cache.get(id)
}

//Listener quand quelqu'un ajoute une reaction 
bot.on("messageReactionAdd", async function(reaction, user){
    if(reaction.message.id != messagesId.roles) return

    let member = await getMemberById(reaction, user.id)
    if(member){
        if(reaction.emoji.name === "🟠"){
            console.log(`LOG: '${nodeColors.green}${user.tag}${nodeColors.reset}' gain role '${nodeColors.blue}PC${nodeColors.reset}'`)
            member.roles.add(rolesId.pc)
        }else if(reaction.emoji.name === "🔵"){
            console.log(`LOG: '${nodeColors.green}${user.tag}${nodeColors.reset}' gain role '${nodeColors.blue}PS4${nodeColors.reset}'`)
            member.roles.add(rolesId.ps4)
        }else if(reaction.emoji.name === "🟢"){
            console.log(`LOG: '${nodeColors.green}${user.tag}${nodeColors.reset}' gain role '${nodeColors.blue}XBOX${nodeColors.reset}'`)
            member.roles.add(rolesId.xbox)
        }else if(reaction.emoji.name === "desastreEcostream"){
            console.log(`LOG: '${nodeColors.green}${user.tag}${nodeColors.reset}' gain role '${nodeColors.blue}EcoStream${nodeColors.reset}'`)
            member.roles.add(rolesId.eco)
        }else{
            reaction.remove()
        }
    }else{
        console.log(`ERROR: ${nodeColors.green}${user.tag}${nodeColors.reset} tried to gain role`)
        console.log(user)
    }
})

//Listener quand quelqu'un enleve une reaction 
bot.on("messageReactionRemove", async function (reaction, user){
    if(reaction.message.id != messagesId.roles) return

    let member = await getMemberById(reaction, user.id)
    if(member){
        if(reaction.emoji.name === "🟠"){
            console.log(`LOG: '${nodeColors.green}${user.tag}${nodeColors.reset}' lost role '${nodeColors.blue}PC${nodeColors.reset}'`)
            member.roles.remove(rolesId.pc)
        }else if(reaction.emoji.name === "🔵"){
            console.log(`LOG: '${nodeColors.green}${user.tag}${nodeColors.reset}' lost role '${nodeColors.blue}PS4${nodeColors.reset}'`)
            member.roles.remove(rolesId.ps4)
        }else if(reaction.emoji.name === "🟢"){
            console.log(`LOG: '${nodeColors.green}${user.tag}${nodeColors.reset}' lost role '${nodeColors.blue}XBOX${nodeColors.reset}'`)
            member.roles.remove(rolesId.xbox)
        }else if(reaction.emoji.name === "desastreEcostream"){
            console.log(`LOG: '${nodeColors.green}${user.tag}${nodeColors.reset}' lost role '${nodeColors.blue}EcoStream${nodeColors.reset}'`)
            member.roles.remove(rolesId.eco)
        }
    }else{
        console.log(`ERROR: ${nodeColors.green}${user.tag}${nodeColors.reset} tried to remove role`)
        console.log(user)
    }
})

//Listener quand quelqu'un rejoint le serveur
bot.on("guildMemberAdd", function(member){
    //On met a jour le salon Membres
    bot.channels.cache.get(channelsId.membres).edit({
        name: `Membres : ${bot.guilds.cache.get(guildsId.desastre).memberCount}`
    })

    //On lui envoit un message de bienvenue
    let messageEmbed = new Discord.MessageEmbed()
    .setTitle("Bienvenue sur le Discord de Desastre_Show")
    .setDescription(`Prenez 2 minutes pour lire les <#${channelsId.regles}> et indiquer votre plateforme pour avoir accès à la totalité du Discord.\n` +
                    "Vous trouverez des canaux écrits pour discuter, partager et demander des conseils sur TESO.\n" +
                    "Des canaux vocaux sont également a votre disposition pour jouer avec vos amis.\n\n" +
                    "Desastre est en Live tous les jours de 20h à 23h sur Twitch : https://www.twitch.tv/desastre_show\n" +
                    "Vous trouverez des Builds à jours, des Guides et Tutoriels sur https://desastreshow.com\n" +
                    "Pour ceux qui préfère les vidéos, vous trouverez des Guides du Débutant, des infos et des news sur sa chaîne YouTube : https://www.youtube.com/c/Desastre")
    .setThumbnail("https://i.ibb.co/qd3dW39/Logo-carr-Desastreshow.png")

    console.log(`LOG: '${nodeColors.green}${member.user.tag}${nodeColors.reset}' got his welcome message`)
    sendPrivateMessage(member, messageEmbed)
})

//Listener quand quelqu'un quitte le serveur
bot.on("guildMemberRemove", function(_member){
    //On met a jour le salon Membres
    bot.channels.cache.get(channelsId.membres).edit({
        name: `Membres : ${bot.guilds.cache.get(guildsId.desastre).memberCount}`
    })
})

//Permet de récupérer une personne aléatoire parmis 100 réactions max d'un message
async function getRandom(winners, startId, isSubRand, reaction, message){
    let returnId
    await reaction.users.fetch({after: startId}).then(function(users){
        console.log(`LOG : Fetch ${users.size} users ...`)
        let winner

        if(isSubRand){
            let atLeastOneSub = false

            users.some(function(user){
                let member = message.guild.members.cache.get(user.id)
                if(member.roles.cache.has(rolesId.sub)){
                    atLeastOneSub = true
                    return true
                }
                return false
            })

            if(atLeastOneSub){
                let isSub = false
                do{
                    winner = users.random()
                    let member = message.guild.members.cache.get(winner.id)
                    isSub = member.roles.cache.has(rolesId.sub)
                }while(!isSub)
            }
        }else{
            winner = users.random()
        }

        if(winner){
            winners.push(winner)
        }

        returnId = users.last().id
    })
    return returnId
}

//Permet de récupérer une liste de gagnant parmis toutes les réactions d'un message
async function getWinners(isSubRand, reaction, message){
    let winners = new Array()

    let lastId
    for(let i=0 ; i<Math.floor(reaction.count/100)+1 ; i++){
        lastId = await getRandom(winners, (lastId?lastId:0), isSubRand, reaction, message)
    }

    return winners
}

//Listener quand un message est envoyé sur le serveur
bot.on('message', async function (message) {
    if(message.author.bot || message.channel instanceof Discord.DMChannel) return

    //////////////////////
    //// GIVEAWAY ALL ////
    //////////////////////
    if(message.content.startsWith("!rand ") && (message.author.id === usersID.desastre || message.author.id === usersID.floliroy)){
        const args = message.content.split(" ")
        let isSubRand = args[1] === "sub"
        let channelId = isSubRand ? args[2] : args[1]

        bot.channels.cache.get(channelsId.giveaway).messages.fetch(channelId).then(async function(msg){
            let reaction = msg.reactions.cache.get("✅") || msg.reactions.cache.get("🟠") || msg.reactions.cache.get("🔵") ||  msg.reactions.cache.get("🟢")
            let winners = await getWinners(isSubRand, reaction, message)
            const winner = winners[Math.floor(Math.random() * winners.length)]
            message.delete()

            if(isSubRand && !winner){
                console.log(`LOG: '${nodeColors.green}${message.author.tag}${nodeColors.reset}' initiated a !rand `
                    + `which get '${nodeColors.blue}${reaction.count}${nodeColors.reset}' results`
                    + `, but there is no '${nodeColors.red}Winner${nodeColors.reset}'`)
                message.channel.send(`Pas de gagnant éligible pour ce tirage au sort ...`)
            }else{
                console.log(`LOG: '${nodeColors.green}${message.author.tag}${nodeColors.reset}' initiated a !rand `
                    + `which get '${nodeColors.blue}${reaction.count}${nodeColors.reset}' results`
                    + `, and the winner is '${nodeColors.red}${winner.username}#${winner.discriminator}${nodeColors.reset}'`)
                message.channel.send(`Bravo <@${winner.id}>, tu as gagné !`)
            }
            
        }).catch(function(_err) {
            sendPrivateMessage(message.member, `L'ID du message '${channelId}' est incorrecte...`)
        })
    /////////////////////////
    //// REACTION ON MSG ////
    /////////////////////////
    }else if(message.content.startsWith("!react ") && (message.author.id === usersID.desastre || message.author.id === usersID.floliroy)){
        const args = message.content.split(" ")

        bot.channels.cache.get(channelsId.giveaway).messages.fetch(args[1]).then(async function(msg){
            const reaction = msg.reactions.cache.get("🎁")
            let response = ""
            let startId = 0

            message.delete()

            for(let i=0 ; i<Math.floor(reaction.count/100)+1 ; i++){
                await reaction.users.fetch({after: startId}).then(users => {
                    for(let user of users.array()){
                        response += `${user.username}#${user.discriminator}\n`
                    }
                    startId = users.last().id
                })
            }
            fs.writeFile("participants.txt", response, function(err){
                if(err) throw err
                message.channel.send("Voici la liste des participants :", {files: ["./participants.txt"]})
            })
        }).catch(function(_err) {
            sendPrivateMessage(message.member, `L'ID du message '${args[1]}' est incorrecte...`)
        })
    ////////////////////////
    //// COMMANDES GDOC ////
    ////////////////////////
    //On vérifie que c'est une commande qui est tapé
    }else if(message.content.startsWith("!")){        
        await doc.loadInfo()
        const sheet = doc.sheetsByIndex[0]
        const rows = await sheet.getRows()

        for(let row of rows){
            if(message.content === row.Commande){
                message.delete()
                console.log(`LOG: '${nodeColors.green}${message.author.tag}${nodeColors.reset}' `
                            + `attempt to use '${nodeColors.red}${message.content}${nodeColors.reset}' ` 
                            + `in the channel '${nodeColors.blue}${message.channel.name}${nodeColors.reset}' ` 
                            + `of the server '${nodeColors.blue}${message.channel.guild.name}${nodeColors.reset}'`)
                //On regarde si l'utilisateur a le rang nécessaire
                if(isAuthorised(message.member)){
                    //On regarde si le message doit etre un Embed ou non
                    if(row.Embed === "TRUE"){
                        let messageEmbed = new Discord.MessageEmbed()
                        .setTitle(row.Titre)
                        .setDescription(row.Message)
                        //On regarde si l'image est une Miniature ou non
                        if(row.Miniature === "TRUE"){
                            messageEmbed.setThumbnail(row.Image)
                        }else{
                            messageEmbed.setImage(row.Image)
                        }
                        //Si c'est la commande help on envoit en mp
                        if(row.Commande === "!help"){
                            sendPrivateMessage(message.member, messageEmbed)
                        }else{
                            return message.channel.send(messageEmbed)
                        }
                    }else{
                        return message.channel.send(row.Message)
                    }   
                }else{
                    sendPrivateMessage(message.member, `Tu n'as pas les droits nécessaire pour exécuter la commande \`${row.commande}\``)
                }
            }
        }
    }
})

bot.login(process.env.DISCORD_TOKEN)