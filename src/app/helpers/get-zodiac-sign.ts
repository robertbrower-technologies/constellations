import * as moment from 'moment';
import { ZodiacDates } from '../constants/zodiac-dates';

export function getZodiacSign(birthday: string): string {
    let birthdayMoment = moment(birthday);
    let year = birthdayMoment.year();
    let month = birthdayMoment.month();
    let day = birthdayMoment.date();
    birthdayMoment = moment(new Date(year, month, day));
    let zodiacSign;
    Object.keys(ZodiacDates).forEach(key => {
      let fromMoment: moment.Moment = moment(new Date(year, ZodiacDates[key].fromMonth - 1, ZodiacDates[key].fromDay));
      let toMoment: moment.Moment = moment(new Date(year, ZodiacDates[key].toMonth - 1, ZodiacDates[key].toDay));
      if (birthdayMoment.isSameOrAfter(fromMoment) && birthdayMoment.isSameOrBefore(toMoment)) {
        zodiacSign = key;
      }
    });
    return zodiacSign;
  }