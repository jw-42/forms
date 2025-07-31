export * from './api-errors'
export * from './get-agreement-hash'
export * from './verify-signature'
export * from './vk-url-decode'
export * from './subscription-helpers'
export * from './subscription-errors'

/**
 * Функция для склонения слов в зависимости от количества
 * @param num - количество
 * @param words - массив из трех форм слова: [одна форма, две формы, пять форм]
 * @returns правильная форма слова для данного количества
 * 
 * Примеры использования:
 * declOfNum(1, ['буст', 'буста', 'бустов']) // 'буст'
 * declOfNum(2, ['буст', 'буста', 'бустов']) // 'буста'
 * declOfNum(5, ['буст', 'буста', 'бустов']) // 'бустов'
 */
export function declOfNum(num: number, words: [string, string, string]): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const remainder = num % 10;
  const caseIndex = remainder < 5 ? remainder : 5;
  const index = (num % 100 > 4 && num % 100 < 20) ? 2 : (cases[caseIndex] ?? 2);
  return words[index] ?? words[2];
}