export default function WeekDays() {
  return [
    ...Array.from(Array(7).keys()).map((i) => {
      const day = new Date(0, 0, i).toLocaleString('en-US', { weekday: 'long' });
      return {
        name: day.toLocaleLowerCase(),
        value: i,
      };
    }),
  ];
}
