import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./DatePicker.module.css";

export interface IDatePickerProps {
    date?: Date;
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
        const days = [...new Array(dayWeek ? dayWeek - 1 : 6)].map((_, j) => (
            <div
                key={`day-empty-${j}`}
                className={`${styles.datePicker__day} ${styles.datePicker__day_empty}`}
            />
        ));
        const dayAmount = new Date(dateByMonth.getFullYear(), dateByMonth.getMonth() + 1, 0).getDate();
        [...new Array(dayAmount)].forEach((_, j) => {
            const dateByDay = new Date(NOW_YEAR, month, j + 1);
            const isSelected = dateByDay.getTime() === date?.getTime() || dateByDay.getTime() === date?.getTime();
            days.push(
                <div
                    key={`day-${j}`}
                    className={`${styles.datePicker__day} ${isSelected ? styles.datePicker__day_selected : ''}`}
                    onClick={() => setDate(dateByDay)}
                >
                    {j + 1}
                </div>
            );
        });
        return {
            monthAndYear: `${MONTHS[dateByMonth.getMonth()]} ${dateByMonth.getFullYear()}`,
            days,
        };
    }, [month, date]);

    return (
        <div className={styles.datePicker}>
            <div className={styles.datePicker__header}>
                <div className={styles.datePicker__arrow} onClick={() => addMonth(-12)}>{'<<'}</div>
                <div className={styles.datePicker__arrow} onClick={() => addMonth(-1)}>{'<'}</div>
                <div className={styles.datePicker__monthAndYear}>{monthAndYear}</div>
                <div className={styles.datePicker__arrow} onClick={() => addMonth(1)}>{'>'}</div>
                <div className={styles.datePicker__arrow} onClick={() => addMonth(12)}>{'>>'}</div>
            </div>
            <div className={styles.datePicker__body}>{days}</div>
        </div>
    );
}
