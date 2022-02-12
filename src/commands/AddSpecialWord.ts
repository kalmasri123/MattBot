import { Command, ExecuteFunction } from './Command';
import { Message } from 'discord.js';
import KeyWord from '@models/KeyWord';
import Response from '@models/Response';
import SpecialWord from '@models/SpecialWord';
class TrainCommand extends Command {
    constructor() {
        super({
            commandName: 'addspecialword',
            minArgs: 3,
        });
    }
    async executeFunction(message: Message, fn: () => void = null) {
        super.executeFunction(message, fn);
        const category = this.args[1];
        const phrase = this.args.slice(2).join(' ');
        const response = new SpecialWord({ category, phrase });
        await response.save()
        message.reply('**Great Success I save**');
    }
}
export default new TrainCommand();
