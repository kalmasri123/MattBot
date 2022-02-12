import { Command, ExecuteFunction } from './Command';
import { Message } from 'discord.js';
import KeyWord from '@models/KeyWord';
class TrainCommand extends Command {
    constructor() {
        super({
            commandName: 'train',
            minArgs: 3,
        });
    }
    executeFunction(message: Message, fn: () => void = null) {
        super.executeFunction(message, fn);
        const category = this.args[1];
        const sentenceWords = this.args.slice(2);
        sentenceWords.forEach(async (word) => {
            let query =
                (await KeyWord.findOne({ word, category })) || new KeyWord({ word, category });
            query.magnitude++;
            await query.save();
        });
        message.reply("**Great Success**")
    }
}
export default new TrainCommand();
