interface IDateProvider {
  compareInHours(end_date: Date): number;
  convertToUTC(date: Date): string;
}

export { IDateProvider };
