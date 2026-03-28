import React, { useState, useRef, useEffect } from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  minDate?: string;
  errors?: {
    startDate?: string;
    endDate?: string;
  };
  isRTL?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  errors,
  isRTL = false,
}) => {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const startCalendarRef = useRef<HTMLDivElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const minDateObj = minDate ? new Date(minDate) : today;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startCalendarRef.current && !startCalendarRef.current.contains(event.target as Node)) {
        setShowStartCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target as Node)) {
        setShowEndCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateForInput = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const parseInputDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    const month = parseInt(parts[0]) - 1;
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  };

  const formatDateForISO = (dateString: string): string => {
    const date = parseInputDate(dateString);
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleStartDateInput = (value: string) => {
    onStartDateChange(formatDateForISO(value));
  };

  const handleEndDateInput = (value: string) => {
    onEndDateChange(formatDateForISO(value));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const isDateInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const isStartDate = (date: Date): boolean => {
    if (!startDate) return false;
    const start = new Date(startDate);
    return date.toDateString() === start.toDateString();
  };

  const isEndDate = (date: Date): boolean => {
    if (!endDate) return false;
    const end = new Date(endDate);
    return date.toDateString() === end.toDateString();
  };

  const isDateDisabled = (date: Date): boolean => {
    return date < minDateObj;
  };

  const handleDateClick = (date: Date, calendarType: 'start' | 'end') => {
    if (isDateDisabled(date)) return;
    
    const dateString = date.toISOString().split('T')[0];
    
    if (calendarType === 'start') {
      onStartDateChange(dateString);
      setShowStartCalendar(false);
      if (endDate && date > new Date(endDate)) {
        onEndDateChange('');
      }
    } else {
      if (startDate && date < new Date(startDate)) {
        // If clicking a date before start date, make it the new start date
        onStartDateChange(dateString);
        onEndDateChange('');
        setShowEndCalendar(false);
        setShowStartCalendar(true);
        setCurrentMonth(date);
      } else {
        onEndDateChange(dateString);
        setShowEndCalendar(false);
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Update current month when calendar opens
  useEffect(() => {
    if (showStartCalendar && startDate) {
      setCurrentMonth(new Date(startDate));
    } else if (showEndCalendar) {
      if (endDate) {
        setCurrentMonth(new Date(endDate));
      } else if (startDate) {
        setCurrentMonth(new Date(startDate));
      }
    }
  }, [showStartCalendar, showEndCalendar, startDate, endDate]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentMonth);

  const renderCalendar = (isStart: boolean) => {
    const showCalendar = isStart ? showStartCalendar : showEndCalendar;
    const calendarRef = isStart ? startCalendarRef : endCalendarRef;

    if (!showCalendar) return null;

    return (
      <div
        ref={calendarRef}
        className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80 p-4"
        style={{ [isRTL ? 'right' : 'left']: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const inRange = isDateInRange(date);
            const isStart = isStartDate(date);
            const isEnd = isEndDate(date);
            const disabled = isDateDisabled(date);

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => handleDateClick(date, showStartCalendar ? 'start' : 'end')}
                disabled={disabled}
                className={`
                  aspect-square text-sm rounded transition-colors
                  ${disabled 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : inRange || isStart || isEnd
                      ? isStart || isEnd
                        ? 'bg-teal-600 text-white font-semibold'
                        : 'bg-teal-100 text-teal-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {/* Start Date */}
      <div className="relative">
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Start Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="startDate"
            name="startDate"
            value={startDate ? formatDateForInput(new Date(startDate)) : ''}
            onChange={(e) => handleStartDateInput(e.target.value)}
            onFocus={() => {
              setShowStartCalendar(true);
              setShowEndCalendar(false);
              if (startDate) {
                setCurrentMonth(new Date(startDate));
              }
            }}
            placeholder="MM/DD/YYYY"
            className={`
              w-full px-4 py-3 border rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors?.startDate ? 'border-red-500' : showStartCalendar ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}
            `}
          />
          <button
            type="button"
            onClick={() => {
              setShowStartCalendar(!showStartCalendar);
              setShowEndCalendar(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        {errors?.startDate && (
          <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
        )}
        {renderCalendar(true)}
      </div>

      {/* End Date */}
      <div className="relative">
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          End Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="endDate"
            name="endDate"
            value={endDate ? formatDateForInput(new Date(endDate)) : ''}
            onChange={(e) => handleEndDateInput(e.target.value)}
            onFocus={() => {
              setShowEndCalendar(true);
              setShowStartCalendar(false);
              if (endDate) {
                setCurrentMonth(new Date(endDate));
              } else if (startDate) {
                setCurrentMonth(new Date(startDate));
              }
            }}
            placeholder="MM/DD/YYYY"
            className={`
              w-full px-4 py-3 border rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors?.endDate ? 'border-red-500' : showEndCalendar ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}
            `}
          />
          <button
            type="button"
            onClick={() => {
              setShowEndCalendar(!showEndCalendar);
              setShowStartCalendar(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        {errors?.endDate && (
          <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
        )}
        {renderCalendar(false)}
      </div>
    </div>
  );
};

export default DateRangePicker;

