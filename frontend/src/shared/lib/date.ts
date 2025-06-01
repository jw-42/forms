import { useState, useEffect } from 'react';

function declOfNum(num: number, words: [string, string, string]): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const index = (num % 100 > 4 && num % 100 < 20) ? 2 : cases[(num % 10 < 5) ? num % 10 : 5];
  return words[index];
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) return `${seconds} ${declOfNum(seconds, ['секунду', 'секунды', 'секунд'])} назад`;
      return `${minutes} ${declOfNum(minutes, ['минуту', 'минуты', 'минут'])} назад`;
    }
    return `${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])} назад`;
  }

  if (days === 1) {
    return `вчера в ${dateObj.getHours()}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
  }

  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const month = months[dateObj.getMonth()];
  const time = `${dateObj.getHours()}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

  if (dateObj.getFullYear() === now.getFullYear()) {
    return `${dateObj.getDate()} ${month} в ${time}`;
  }

  return `${dateObj.getDate()} ${month} ${dateObj.getFullYear()} в ${time}`;
}

export function useAutoUpdateTime(date: string | Date): string {
  const [formattedDate, setFormattedDate] = useState(formatDate(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDate(formatDate(date));
    }, 3000);

    return () => clearInterval(interval);
  }, [date]);

  return formattedDate;
} 