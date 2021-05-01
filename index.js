const dotenv = require('dotenv');
var Airtable = require('airtable');
var base = new Airtable({ apiKey: `${process.env.AIRTABLE_API_KEY}` }).base('apppbhsk0pZUmRqYh');
const Discord = require("discord.js");
const client = new Discord.Client();

dotenv.config()

client.login(process.env.DISCORD_TOKEN);
client.on("ready", () => {
    console.log("I am ready!");
    var myGuild = client.guilds.cache.get('735180366297563257');

    base('Members').select({
        maxRecords: 100,
        view: "NewMembers"
    }).eachPage(function page(records, fetchNextPage) {
            records.forEach(async function(record) {

                let userid = record.get('UserId');
                let firstname = record.get('FullName');
                let member = await myGuild.members.fetch(userid);

                if (record.fields["CampusCommunityActive"] === "Yes") {
                    await member.roles.add('735213943034740857').catch(console.error);
                    let peru = await myGuild.members.cache.get(userid);
                    peru = peru.nickname;
                    // console.log(peru)
                    await myGuild.members.cache.get(userid).setNickname(`${firstname} 🎓`);
                    console.log(`${firstname} = ${peru} / campus`)
                        // console.log(userid)
                        // console.log('Retrieved', record.get('MobileNumber'));
                } else if (record.fields["CampusCommunityActive"] != "Yes") {
                    let peru = await myGuild.members.cache.get(userid);
                    peru = peru.nickname;
                    await myGuild.members.cache.get(userid).setNickname(`${firstname}`);
                    console.log(`${firstname} = ${peru} / non-campus`)
                        // console.log(userid)
                        // console.log('Retrieved', record.get('MobileNumber'));
                } else {
                    console.log('Kittila', record.get('FirstName'));
                }
            });
            console.log("Thanks for coming! :D")
            fetchNextPage();

        }

    );

});