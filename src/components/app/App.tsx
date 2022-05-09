import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { DatePicker } from "../date-picker/DatePicker";
import { DateRangePicker } from "../date-range-picker/DateRangePicker";

const DATE = new Date();
const DATE_MIN = new Date(DATE.getFullYear(), DATE.getMonth() - 2, 15);
const DATE_MAX = new Date(DATE.getFullYear(), DATE.getMonth() + 2, 15);

export function App() {
    const [date, setDate] = useState<Date>();
    const [dates, setDates] = useState<Date[]>();

    useEffect(() => {
        console.log(date, dates);
    }, [date, dates])

    return (
        <div className={`container ${styles.app}`}>
            <DatePicker date={date} dateMin={DATE_MIN} dateMax={DATE_MAX} onChange={setDate} />
            <DateRangePicker dates={dates} dateMin={DATE_MIN} dateMax={DATE_MAX} onChange={setDates} />
        </div>
    );
}
