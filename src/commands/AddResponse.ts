import { Command, ExecuteFunction } from './Command';
import { Message } from 'discord.js';
import KeyWord from '@models/KeyWord';
import Response from '@models/Response';
class TrainCommand extends Command {
    constructor() {
        super({
            commandName: 'addresponse',
            minArgs: 3,
        });
    }
    async executeFunction(message: Message, fn: () => void = null) {
        super.executeFunction(message, fn);
        const category = this.args[1];
        const sentence = this.args.slice(2).join(' ');
        const response = new Response({ category, sentence });
        await response.save()
        message.reply('**Great Success I respond**');
    }
}
export default new TrainCommand();
