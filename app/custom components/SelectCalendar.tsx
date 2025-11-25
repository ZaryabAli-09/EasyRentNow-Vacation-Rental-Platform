"use client";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import { DateRange, RangeKeyDict } from "react-date-range";
import { useState } from "react";

interface SelectCalendarProps {
  onDateChange?: (startDate: Date, endDate: Date) => void;
  disabledDates?: Date[];
}

interface DateRangeSelection {
  startDate: Date;
  endDate: Date;
  key: "selection";
}

export function SelectCalendar({
  onDateChange,
  disabledDates = [],
}: SelectCalendarProps) {
  const [state, setState] = useState<DateRangeSelection[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection as DateRangeSelection;
    setState([{ ...selection }]);
    if (onDateChange) {
      onDateChange(selection.startDate, selection.endDate);
    }
  };

  return (
    <>
      <input
        type="hidden"
        name="startDate"
        value={state[0].startDate.toISOString()}
      />
      <input
        type="hidden"
        name="endDate"
        value={state[0].endDate.toISOString()}
      />

      <DateRange
        ranges={state}
        onChange={handleChange}
        minDate={new Date()}
        disabledDates={disabledDates}
        showDateDisplay={false}
        rangeColors={["#FF5A5F"]}
        direction="vertical"
      />
    </>
  );
}
