import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { DatePicker } from "../date-picker/DatePicker";

export function App() {
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        console.log(date);
    }, [date])

    return (
        <div className={`container ${styles.app}`}>
            <DatePicker date={date} onChange={setDate} />
        </div>
    );
}
