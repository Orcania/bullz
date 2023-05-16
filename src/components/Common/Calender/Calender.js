import Dialog from "@material-ui/core/Dialog";

import React, { useState, useEffect } from "react";
import { printLog } from "utils/printLog";

import "./Calender.scss";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
Object.freeze(months);
const getFirstDayOfMonth = (currentDate) => {
  return new Date(
    new Date(currentDate).getFullYear(),
    new Date(currentDate).getMonth(),
    1
  );
};

const getLastDayOfMonth = (currentDate) => {
  return new Date(
    new Date(currentDate).getFullYear(),
    new Date(currentDate).getMonth() + 1,
    0
  );
};

const createCalendarRows = (firstDay, totalDays) => {
  printLog([firstDay, totalDays], 'success');
  let calendar1D = [];
  let calendar2D = [];
  let count = 0;
  for (let i = 0; i < 42; i++) {
    if (i < firstDay) {
      calendar1D[i] = 0;
    } else if (count < totalDays) {
      count++;
      calendar1D[i] = count;
    }
  }
  while (calendar1D.length) calendar2D.push(calendar1D.splice(0, 7));
  printLog([calendar2D], 'success');
  return calendar2D;
};

const Calendar = (props) => {
  const [dialogOpen, setDialogOpen] = useState(true);
  const [month, setMonth] = useState(new Date(Date.now()).getMonth());
  const [year, setYear] = useState(new Date(Date.now()).getFullYear());
  const [currentDate, setCurrentDate] = useState(new Date(Date.now()));
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(
    getFirstDayOfMonth(currentDate)
  );

  const [lastDayOfMonth, setLastDayOfMonth] = useState(
    getLastDayOfMonth(currentDate)
  );

  const [calendarData, setCalendarData] = useState(
    createCalendarRows(firstDayOfMonth.getDay(), lastDayOfMonth.getDate())
  );
  const [selected, setSelected] = useState("");
  const [hour, setHour] = useState(new Date().getHours());
  const [minutes, setMinutes] = useState(new Date().getMinutes());

  const toggleMonthAction = (type) => {
    let newMonth = month;
    let newYear = year;
    if (type === "dec") {
      if (newMonth === 0) {
        newYear -= 1;
        newMonth = 11;
      } else newMonth = newMonth - 1;
    } else {
      if (newMonth === 11) {
        newYear += 1;
        newMonth = 0;
      } else newMonth = newMonth + 1;
    }

    let currDateWithMonth = new Date().setMonth(newMonth);
    let currDateWithYear = new Date(currDateWithMonth).setFullYear(newYear);
    let fd = getFirstDayOfMonth(currDateWithYear);
    let ld = getLastDayOfMonth(currDateWithYear);
    setSelected("");
    setMonth(newMonth);
    setYear(newYear);
    setCurrentDate(currDateWithYear);
    setFirstDayOfMonth(fd);
    setLastDayOfMonth(ld);
    setCalendarData(createCalendarRows(fd.getDay(), ld.getDate()));
  };

  printLog(["firstDayOfMonth", firstDayOfMonth], 'success');
  printLog(["lastDayOfMonth", lastDayOfMonth], 'success');
  printLog(["selectedData", selected], 'success');
  useEffect(() => {
    setCalendarData(
      createCalendarRows(firstDayOfMonth.getDay(), lastDayOfMonth.getDate())
    );

    let selectedData = {
      date: new Date().getDate(),
      month: months[new Date().getMonth()],
      year: new Date().getFullYear(),
    };
    setSelected(selectedData);
    setDialogOpen(true);
  }, []);

  const getSchduleDate = (date) => {
    let selectedDate = date;
    let selectedMonth = months[month];
    let selectedYear = year;
    let selectedData = {
      date: selectedDate,
      month: selectedMonth,
      year: selectedYear,
    };
    setSelected(selectedData);
  };

  const date = new Date();
  let uts = date.getTimezoneOffset();
  uts = uts * -1; // convert negative to postive
  uts = uts / 60; //covert minutes to hours

  const hourChangeHandler = (e) => {
    const re = /(^[0-9]+$|^$|^\s$)/;
    if (
      re.test(e.target.value) &&
      (e.target.value >= "0" || e.target.value === "")
    ) {
      printLog([e.target.value], 'success');
      setHour(e.target.value);
    }
  };
  const minutesChangeHandler = (e) => {
    const re = /(^[0-9]+$|^$|^\s$)/;
    if (
      re.test(e.target.value) &&
      (e.target.value >= "0" || e.target.value === "")
    ) {
      printLog([e.target.value], 'success');
      setMinutes(e.target.value);
    }
  };

  const schduledDataAnTime = () => {
    if (
      selected &&
      hour!=="" &&
      minutes!=="" &&
      parseInt(hour) <= 23 &&
      parseInt(minutes) <= 59
    ) {
      printLog([year, month, date, hour, minutes, 0, 0], 'success');
      // new Date(year, month, day, hours, minutes, seconds, milliseconds)
      const d = new Date(year, month, selected.date, hour, minutes, 0, 0);

      printLog([d], 'success');
      props.onConfirm(d)
    }
  };

  const onHide = () => {
    setDialogOpen(false);
    props.onHide(false);
  };

  return (
    <Dialog className="calanderDialog" open={props.open} onClose={onHide} sx={{bgColor: 'none !important'}}>
      <div className={"calendarMainDiv"}>
        <div className={"monthYear"}>
          <div onClick={() => toggleMonthAction("dec")}>
            <img src={'/images/arrow_left.png'} alt="Left Arrow" style={{transform: "rotate(180deg)"}}/>
            {/* P */}
          </div>
          <h2 style={{ textAlign: "center" }}>{`${months[month]} ${year}`}</h2>
          <div onClick={() => toggleMonthAction("inc")}>
            <img src={'/images/arrow_left.png'} alt="Right Arrow"/>
            {/* N */}
          </div>
        </div>
        <div className={"selectDay"}>
          <div className={"nameOfDay"}>
            <table>
              <tbody>
                <tr>
                  {days.map((dayName, index) => {
                    return <td key={index}>{dayName}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className={"selectDate"}>
            <table>
              <tbody>
                {calendarData.map((row, index) => (
                  <tr key={index}>
                    {row.map((date, index) => (
                      <td
                        key={index}
                        onClick={() => {
                          getSchduleDate(date);
                        }}
                        style={{
                          backgroundColor:
                            selected?.date === date &&
                            selected?.month === months[month] &&
                            selected?.year === year
                              ? "#4353FF"
                              : "transparent",
                          // color:
                          //   selected?.date === date &&
                          //   selected?.month === months[month] &&
                          //   selected?.year === year
                          //     ? "black"
                          //     : "white",
                        }}
                      >
                        {date !== 0 ? date : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={"selectTimeMain"}>
          <div className={"selectTime"}>
            <div className={"selectTimeContent"}>
              <h6>Select Time</h6>
              <span>
                Time in UTC+{uts}
              </span>
            </div>
            <div className={"selectTimeInput"}>
              <input
                type="text"
                placeholder="00"
                maxLength="2"
                value={hour}
                onChange={hourChangeHandler}
              />
              <span className={"secondsDots"}>:</span>
              <input
                type="text"
                placeholder="00"
                maxLength="2"
                value={minutes}
                onChange={minutesChangeHandler}
              />
            </div>
          </div>
          <div className={"applyButton"}>
            <button onClick={schduledDataAnTime}>Apply</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Calendar;
