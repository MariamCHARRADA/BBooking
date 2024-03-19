import {Calendar} from 'react-native-calendars';

 export default function MyCalendar () {
  return (
    <Calendar
      // Handler which gets executed on day press
      onDayPress={(day) => {
        console.log('Selected day', day);
        // Load available times for this day
      }}
      // Mark dates with custom dots or styles
      markedDates={{
        '2024-03-16': {selected: true, marked: true, selectedColor: 'blue'},
        '2024-03-17': {marked: true},
        '2024-03-18': {disabled: true, disableTouchEvent: true}
      }}
    />
  );
};