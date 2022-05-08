import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./DateRangePicker.module.css";

export interface IDateRangePickerProps {
    dates?: Date[];
    onChange?(date?: Date[]): void;
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
            const days = [...new Array(dayWeek ? dayWeek - 1 : 6)].map((_, j) => (
                <div
                    key={`day-empty-${j}`}
                    className={`${styles.datePicker__day} ${styles.datePicker__day_empty}`}
                />
            ));
            const dayAmount = new Date(dateByMonth.getFullYear(), dateByMonth.getMonth() + 1, 0).getDate();
            [...new Array(dayAmount)].forEach((_, j) => {
                const dateByDay = new Date(NOW_YEAR, i, j + 1);
                const isSelected = dateByDay.getTime() === dates[0]?.getTime() || dateByDay.getTime() === dates[1]?.getTime();
                const isРighlighted = dates.length === 2 && dateByDay.getTime() > dates[0].getTime() && dateByDay.getTime() < dates[1].getTime();
                days.push(
                    <div
                        key={`day-${j}`}
                        className={`
                            ${styles.datePicker__day}
                            ${isSelected ? styles.datePicker__day_selected : ''}
                            ${isРighlighted ? styles.datePicker__day_highlighted : ''}
                        `}
                        onClick={() => addDate(dateByDay)}
                    >
                        {j + 1}
                    </div>
                );
            });
            datePickers.push({
                monthAndYear: `${MONTHS[dateByMonth.getMonth()]} ${dateByMonth.getFullYear()}`,
                days,
            });
        });
        return datePickers;
    }, [months, dates]);

    const range = useMemo(() => {
        return dates.length === 2 ? `${dates[0].toLocaleDateString('ru')} - ${dates[1].toLocaleDateString('ru')}` : '';
    }, [dates]);

    return (
        <div className={styles.dateRangePicker}>
            <div className={styles.dateRangePicker__pickers}>
                <div className={styles.datePicker}>
                    <div className={styles.datePicker__header}>
                        <div className={styles.datePicker__arrow} onClick={() => addMonths([-12, 0])}>{'<<'}</div>
                        <div className={styles.datePicker__arrow} onClick={() => addMonths([-1, 0])}>{'<'}</div>
                        <div className={styles.datePicker__monthAndYear}>{datePickers[0].monthAndYear}</div>
                        <div className={styles.datePicker__arrow} onClick={monthsDiff > 1 ? () => addMonths([1, 0]) : undefined}>
                            {monthsDiff > 1 ? '>' : ''}
                        </div>
                        <div className={styles.datePicker__arrow} onClick={monthsDiff > 12 ? () => addMonths([12, 0]) : undefined}>
                            {monthsDiff > 12 ? '>>' : ''}
                        </div>
                    </div>
                    <div className={styles.datePicker__body}>{datePickers[0].days}</div>
                </div>
                <div className={styles.datePicker}>
                    <div className={styles.datePicker__header}>
                        <div className={styles.datePicker__arrow} onClick={monthsDiff > 12 ? () => addMonths([0, -12]) : undefined}>
                            {monthsDiff > 12 ? '<<' : ''}
                        </div>
                        <div className={styles.datePicker__arrow} onClick={monthsDiff > 1 ? () => addMonths([0, -1]) : undefined}>
                            {monthsDiff > 1 ? '<' : ''}
                        </div>
                        <div className={styles.datePicker__monthAndYear}>{datePickers[1].monthAndYear}</div>
                        <div className={styles.datePicker__arrow} onClick={() => addMonths([0, 1])}>{'>'}</div>
                        <div className={styles.datePicker__arrow} onClick={() => addMonths([0, 12])}>{'>>'}</div>
                    </div>
                    <div className={styles.datePicker__body}>{datePickers[1].days}</div>
                </div>
            </div>
            <div className={styles.dateRangePicker__range}>{range}</div>
        </div>
    );
}
