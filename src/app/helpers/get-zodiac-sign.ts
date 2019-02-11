import { ZodiacDates } from '../constants/zodiac-dates';

export function getZodiacSign(birthday: string): string {
    let date = new Date(birthday);
    let year = date.getFullYear();
    let time = date.getTime();
    let zodiacSign;
    Object.keys(ZodiacDates).forEach(key => {
      let fromDate = new Date(year, ZodiacDates[key].fromMonth - 1, ZodiacDates[key].fromDay);
      let toDate = new Date(year, ZodiacDates[key].toMonth - 1, ZodiacDates[key].toDay);
      if (time >= fromDate.getTime() && time <= toDate.getTime()) {
        zodiacSign = key;
      }
    });
    return zodiacSign;
  }