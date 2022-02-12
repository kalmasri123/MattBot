import { Presence, TextChannel } from 'discord.js';
const playingLeague = (el) => el.name.toLowerCase() == `league of legends` && el.type == 'PLAYING';
const findRole = (el) => el.name.toLowerCase() == 'league player';
export default async function PresenceUpdate(oldPresence: Presence, newPresence: Presence) {

}
