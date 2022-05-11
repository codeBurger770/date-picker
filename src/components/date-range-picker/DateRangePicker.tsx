import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./DateRangePicker.module.css";

export interface IDateRangePickerProps {
    dates?: Date[];
    dateMin?: Date;
    dateMax?: Date;
    onChange?(dates?: Date[]): void;
}

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const NOW_YEAR = new Date().getFullYear();
const NOW_MONTH = new Date().getMonth();

export function DateRangePicker(props: IDateRangePickerProps) {
    const [months, setMonths] = useState([NOW_MONTH, NOW_MONTH + 1]);
    const [dates, setDates] = useState<Date[]>(props.dates ?? []);

    useEffect(() => {
        props.onChange?.(dates.length === 1 ? [dates[0], dates[0]] : dates);
    }, [dates]);

    const addMonths = useCallback((months: [number, number]) => setMonths(i => [i[0] + months[0], i[1] + months[1]]), []);
    const addDate = useCallback((date: Date) => setDates(i => i.length < 2 ? [...i, date].sort((j, k) => j.getTime() - k.getTime()) : [date]), []);

    const monthsDiff = useMemo(() => months[1] - months[0], [months]);

    const datePickers = useMemo(() => {
        const datePickers: { monthAndYear: string; days: JSX.Element[]; }[] = [];
        months.map(i => {
            const dateByMonth = new Date(NOW_YEAR, i);
            dateByMonth.setDate(1);
            const dayWeek = dateByMonth.getDay();
            const dayAmount = new Date(dateByMonth.getFullYear(), dateByMonth.getMonth() + 1, 0).getDate();
            const days = [...new Array(dayAmount)].map((_, j) => {
                const dateByDay = new Date(NOW_YEAR, i, j + 1);
                const isDisabled = (props.dateMin && dateByDay.getTime() < props.dateMin.getTime()) || (props.dateMax && dateByDay.getTime() > props.dateMax.getTime());
                const isSelected = dateByDay.getTime() === dates[0]?.getTime() || dateByDay.getTime() === dates[1]?.getTime();
                const isInner = dates.length === 2 && dateByDay.getTime() > dates[0].getTime() && dateByDay.getTime() < dates[1].getTime();
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
                        className={`
                            ${styles.datePicker__day}
                            ${isSelected ? styles.datePicker__day_selected : ''}
                            ${isInner ? styles.datePicker__day_inner : ''}
                        `}
                        style={{ marginLeft: j ? undefined : (dayWeek ? dayWeek - 1 : 6) * 40 }}
                        onClick={() => addDate(dateByDay)}
                    >
                        {j + 1}
                    </button>
                );
            });
            datePickers.push({
                monthAndYear: `${MONTHS[dateByMonth.getMonth()]} ${dateByMonth.getFullYear()}`,
                days,
            });
        });
        return datePickers;
    }, [props.dateMin, props.dateMax, months, dates]);

    const range = useMemo(() => {
        return dates.length === 2 ? `${dates[0].toLocaleDateString('ru')} - ${dates[1].toLocaleDateString('ru')}` : '';
    }, [dates]);

    return (
        <div className={styles.dateRangePicker}>
            <div className={styles.dateRangePicker__pickers}>
                <div className={styles.datePicker}>
                    <div className={styles.datePicker__header}>
                        <button className={styles.datePicker__arrow} onClick={() => addMonths([-12, 0])}>{'<<'}</button>
                        <button className={styles.datePicker__arrow} onClick={() => addMonths([-1, 0])}>{'<'}</button>
                        <div className={styles.datePicker__monthAndYear}>{datePickers[0].monthAndYear}</div>
                        {monthsDiff > 1 ? (
                            <button className={styles.datePicker__arrow} onClick={() => addMonths([1, 0])}>{'>'}</button>
                        ) : (
                            <div className={`${styles.datePicker__arrow} ${styles.datePicker__arrow_disabled}`} />
                        )}
                        {monthsDiff > 12 ? (
                            <button className={styles.datePicker__arrow} onClick={() => addMonths([12, 0])}>{'>>'}</button>
                        ) : (
                            <div className={`${styles.datePicker__arrow} ${styles.datePicker__arrow_disabled}`} />
                        )}
                    </div>
                    <div className={styles.datePicker__body}>{datePickers[0].days}</div>
                </div>
                <div className={styles.datePicker}>
                    <div className={styles.datePicker__header}>
                        {monthsDiff > 12 ? (
                            <button className={styles.datePicker__arrow} onClick={() => addMonths([0, -12])}>{'<<'}</button>
                        ) : (
                            <div className={`${styles.datePicker__arrow} ${styles.datePicker__arrow_disabled}`} />
                        )}
                        {monthsDiff > 1 ? (
                            <button className={styles.datePicker__arrow} onClick={() => addMonths([0, -1])}>{'<'}</button>
                        ) : (
                            <div className={`${styles.datePicker__arrow} ${styles.datePicker__arrow_disabled}`} />
                        )}
                        <div className={styles.datePicker__monthAndYear}>{datePickers[1].monthAndYear}</div>
                        <button className={styles.datePicker__arrow} onClick={() => addMonths([0, 1])}>{'>'}</button>
                        <button className={styles.datePicker__arrow} onClick={() => addMonths([0, 12])}>{'>>'}</button>
                    </div>
                    <div className={styles.datePicker__body}>{datePickers[1].days}</div>
                </div>
            </div>
            <div className={styles.dateRangePicker__range}>{range}</div>
        </div>
    );
}
