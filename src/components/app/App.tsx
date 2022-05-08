import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { DatePicker } from "../date-picker/DatePicker";
import { DateRangePicker } from "../date-range-picker/DateRangePicker";

export function App() {
    const [date, setDate] = useState<Date>();
    const [dates, setDates] = useState<Date[]>();

    useEffect(() => {
        console.log(date, dates);
    }, [date, dates])

    return (
        <div className={`container ${styles.app}`}>
            <DatePicker date={date} onChange={setDate} />
            <DateRangePicker dates={dates} onChange={setDates} />
        </div>
    );
}
