import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  compareInHours(end_date: Date): number {
    const start_date_utc = this.convertToUTC(dayjs().toDate());
    const end_date_utc = this.convertToUTC(end_date);

    return dayjs(end_date_utc).diff(start_date_utc, "hours");
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }
}

export { DayjsDateProvider };
