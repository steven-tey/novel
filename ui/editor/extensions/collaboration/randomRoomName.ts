import { uniqueNamesGenerator, adjectives, starWars, animals } from 'unique-names-generator';

export function randomRoomName() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, starWars, animals],
    separator: '-',
    length: 3,
    style: 'lowerCase'
  }).replace(/ /g, '')
}