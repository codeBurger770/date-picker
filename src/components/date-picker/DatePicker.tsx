import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./DatePicker.module.css";

export interface IDatePickerProps {
    date?: Date;
    dateMin?: Date;
    dateMax?: Date;
    onChange?(date?: Date): void;
}

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const NOW_YEAR = new Date().getFullYear();
const NOW_MONTH = new Date().getMonth();

export function DatePicker(props: IDatePickerProps) {
    const [month, setMonth] = useState(NOW_MONTH);
    const [date, setDate] = useState(props.date);

    useEffect(() => {
        props.onChange?.(date);
    }, [date]);

    const addMonth = useCallback((month: number) => setMonth(i => i + month), []);

    const { monthAndYear, days } = useMemo(() => {
        const dateByMonth = new Date(NOW_YEAR, month);
        dateByMonth.setDate(1);
        const dayWeek = dateByMonth.getDay();
        const dayAmount = new Date(dateByMonth.getFullYear(), dateByMonth.getMonth() + 1, 0).getDate();
        const days = [...new Array(dayAmount)].map((_, j) => {
            const dateByDay = new Date(NOW_YEAR, month, j + 1);
            const isDisabled = (props.dateMin && dateByDay.getTime() < props.dateMin.getTime()) || (props.dateMax && dateByDay.getTime() > props.dateMax.getTime());
            const isSelected = dateByDay.getTime() === date?.getTime() || dateByDay.getTime() === date?.getTime();
            return isDisabled ? (
                <div
                    key={j}
                    className={`${styles.datePicker__day} ${styles.datePicker__day_disabled}`}
                    style={{ marginLeft: j ? undefined : (dayWeek ? dayWeek - 1 : 6) * 40 }}
                >
                    {j + 1}
                </div>
            ) : (
                <button
                    key={j}
                    className={`${styles.datePicker__day} ${isSelected ? styles.datePicker__day_selected : ''}`}
                    style={{ marginLeft: j ? undefined : (dayWeek ? dayWeek - 1 : 6) * 40 }}
                    onClick={() => setDate(dateByDay)}
                >
                    {j + 1}
                </button>
            );
        });
        return {
            monthAndYear: `${MONTHS[dateByMonth.getMonth()]} ${dateByMonth.getFullYear()}`,
            days,
        };
    }, [props.dateMin, props.dateMax, month, date]);

    return (
        <div className={styles.datePicker}>
            <div className={styles.datePicker__header}>
                <button className={styles.datePicker__arrow} onClick={() => addMonth(-12)}>{'<<'}</button>
                <button className={styles.datePicker__arrow} onClick={() => addMonth(-1)}>{'<'}</button>
                <div className={styles.datePicker__monthAndYear}>{monthAndYear}</div>
                <button className={styles.datePicker__arrow} onClick={() => addMonth(1)}>{'>'}</button>
                <button className={styles.datePicker__arrow} onClick={() => addMonth(12)}>{'>>'}</button>
            </div>
            <div className={styles.datePicker__body}>{days}</div>
        </div>
    );
}
