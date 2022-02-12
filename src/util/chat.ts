import { Message } from 'discord.js';
import Response from '@models/Response';
import KeyWord from '@models/KeyWord';
import SpecialWord from '@models/SpecialWord';
interface WordCategory {
    keywords: any[];
    category: string;
    magnitude: number;
}

function findMaxMagnitude(categories: WordCategory[]): WordCategory[] {
    let highestCategories: WordCategory[] = [];
    let max: Number = 0;
    categories.forEach((el: WordCategory) => {
        let obj = el;
        if (obj.magnitude > max) {
            highestCategories.length = 0;
            highestCategories.push(obj);
            max = obj.magnitude;
        } else if (obj.magnitude == max) {
            highestCategories.push(obj);
        }
    });
    return highestCategories;
}
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const templates = {
    DAY_OF_WEEK_ALL_CAPS: function (m1) {
        return DAYS_OF_WEEK[new Date().getDay()].toUpperCase();
    },
};
const arrayMax = function (arr) {
    return arr.reduce(function (a, b) {
        return Math.max(a, b);
    });
};
const limitNumber = (num: number, max: number): number => {
    return num > max ? max : num;
};
function reduceMagnitudes(highestCategories: WordCategory[], otherMatches: WordCategory[]): void {
    highestCategories.forEach((wordCategory, i) => {
        wordCategory.keywords.forEach(({ magnitude, word }, i) => {
            const getMagnitude = (el) =>
                el.keywords.find((ele) => ele.word == word)?.magnitude || 0;
            const magnitudes = otherMatches.map(getMagnitude);
            wordCategory.magnitude -= limitNumber(arrayMax(magnitudes), magnitude);
        });
    });
}
function getRandomElement<Type>(arr: Type[]): Type {
    return arr[Math.floor(Math.random() * arr.length)];
}
export async function handleChatMessage(message: Message) {
    const args = message.content.split(' ');
    let categoriesObj = {};
    const keywords = await KeyWord.find({ word: { $in: args } });
    keywords.forEach((el) => {
        if (!categoriesObj[el.category])
            categoriesObj[el.category] = { keywords: [], magnitude: 0, category: null };
        categoriesObj[el.category]['keywords'].push(el);
        categoriesObj[el.category]['category'] = el.category;
        categoriesObj[el.category]['magnitude'] += el.magnitude;
    });
    const categories = Object.values(categoriesObj) as WordCategory[];
    const highestWordCategories = findMaxMagnitude(categories);
    highestWordCategories.forEach((el) =>
        categories.splice(
            categories.findIndex((ele) => ele.category == el.category),
            1,
        ),
    );

    reduceMagnitudes(highestWordCategories, categories);
    //After reduction, get max
    const filtered = highestWordCategories.filter((el) => el.magnitude >= 3);
    if (filtered.length == 0) return;
    const finalCategories = findMaxMagnitude(filtered);
    const decidedCategory = getRandomElement(finalCategories);
    const messageContent = message.content;
    const specialWords = (await SpecialWord.find({})).filter((el) =>
        messageContent.includes(el.phrase),
    );
    console.log('SPECIAL WORDS', specialWords);
    const possibleResponses = await Response.find({ category: decidedCategory.category });
    const specialResponses = possibleResponses.filter((el) => {
        console.log('RESPONSES', el);

        return (
            el.sentence.match(/\$(\S+)/g) &&
            specialWords.every((ele) => el.sentence.includes(`$${ele.category}`))
        );
    });
    let responseSentence;
    if (specialWords.length > 0 && specialResponses.length > 0) {
        //Do special response
        const decidedResponse = getRandomElement(specialResponses);

        responseSentence = decidedResponse.sentence.replace(/\$(\S+)/g, function (match, m1) {
            return specialWords.find((el) => el.category == m1).phrase;
        });
    } else {
        //Dont do special response
        responseSentence = getRandomElement(
            possibleResponses.filter(
                (el) => !specialResponses.find((ele) => ele._id.equals(el._id)),
            ),
        )?.sentence;
    }
    responseSentence = responseSentence.replace(/%(.+)%/g, function (match, m1) {
        let replacement = templates[m1] ? templates[m1](m1) : match;
        console.log(replacement);
        return replacement;
    });
    return message.channel.send(responseSentence);
}
