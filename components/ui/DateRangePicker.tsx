'use client';

import * as React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from './Button';

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
      <Calendar className="mr-2 h-4 w-4" />
      <span>
        {value.from.toLocaleDateString()} - {value.to.toLocaleDateString()}
      </span>
    </Button>
  );
}