import { Command, ExecuteFunction } from './Command';
import { Message } from 'discord.js';

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
        const sentence = this.args.slice(2);

    }
}
export default new TrainCommand();
