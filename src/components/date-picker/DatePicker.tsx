import { useCallback, useMemo, useState } from "react";
import styles from "./DatePicker.module.css";

export interface IDatePickerProps {
    date?: Date;
    onChange?(date: Date): void;
}

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const NOW_YEAR = new Date().getFullYear();
const NOW_MONTH = new Date().getMonth();

export function DatePicker(props: IDatePickerProps) {
    const [monthActive, setMonthActive] = useState(NOW_MONTH);
    const [dateActive, setDateActive] = useState(props.date);

    const { monthAndYear, voids } = useMemo(() => {
        const date = new Date(NOW_YEAR, monthActive);
        date.setDate(1);
        const dayWeek = date.getDay();
        return {
            monthAndYear: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
            voids: [...new Array(dayWeek ? dayWeek - 1 : 6)].map((_, i) => ({
                key: `void-${i}`,
            })),
        };
    }, [monthActive]);

    const days = useMemo(() => {
        const date = new Date(NOW_YEAR, monthActive);
        const dayAmount = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        return [...new Array(dayAmount)].map((_, i) => ({
            key: `day-${i}`,
            day: i + 1,
            isActive: !(new Date(NOW_YEAR, monthActive, i + 1).getTime() - (dateActive?.getTime() ?? 0)),
        }));
    }, [monthActive, dateActive]);

    const handleClickArrowMonthPrev = useCallback(() => setMonthActive(monthActivePrev => monthActivePrev - 1), []);
    const handleClickArrowMonthNext = useCallback(() => setMonthActive(monthActivePrev => monthActivePrev + 1), []);
    const handleClickArrowYearPrev = useCallback(() => setMonthActive(monthActivePrev => monthActivePrev - 12), []);
    const handleClickArrowYearNext = useCallback(() => setMonthActive(monthActivePrev => monthActivePrev + 12), []);
    const handleClickDay = useCallback((day: number) => {
        const date = new Date(NOW_YEAR, monthActive, day);
        setDateActive(date);
        props.onChange?.(date);
    }, [monthActive]);

    return (
        <div className={styles.datePicker}>
            <div className={styles.datePicker__header}>
                <div className={styles.datePicker__arrow} onClick={handleClickArrowYearPrev}>&lt;&lt;</div>
                <div className={styles.datePicker__arrow} onClick={handleClickArrowMonthPrev}>&lt;</div>
                <div className={styles.datePicker__monthAndYear}>{monthAndYear}</div>
                <div className={styles.datePicker__arrow} onClick={handleClickArrowMonthNext}>&gt;</div>
                <div className={styles.datePicker__arrow} onClick={handleClickArrowYearNext}>&gt;&gt;</div>
            </div>
            <div className={styles.datePicker__body}>
                <>
                    {voids.map(i => <div key={i.key} className={styles.datePicker__void} />)}
                    {days.map(i => (
                        <div
                            key={i.key}
                            className={`${styles.datePicker__day} ${i.isActive ? styles.datePicker__day_active : ''}`}
                            onClick={() => handleClickDay(i.day)}
                        >
                            {i.day}
                        </div>
                    ))}
                </>
            </div>
        </div>
    );
}
