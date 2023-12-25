import { useAppDispatch } from "@hooks/customHooks.ts";
import { PagingWithExtraInfo } from "@redux/types/filterTypes.ts";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useEffect, useState } from 'react';
import { calculateTotalPages } from "../../utils/paging.ts";


interface PagerProps extends PagingWithExtraInfo {
    setTake: ActionCreatorWithPayload<any>,
    setSkip: ActionCreatorWithPayload<any>,
    capacity: number,
    bottom?: string
}

const Pager = ({ setSkip, setTake, capacity = 0, perPage, take, skip, extensions, bottom }: PagerProps) => {

    const [activePage, setActivePage] = useState<number>(1);
    const dispatch = useAppDispatch();
    const initialCapacity = capacity;
    capacity = capacity * 3 - (capacity - 1);

    const [pagesToDisplay, setPagesToDisplay] = useState<number[]>([]);

    useEffect(() => {

        const pages = [];
        const totalPages = calculateTotalPages(extensions?.count!, take);
        for (let i = 0; i < totalPages; i++) {
            if (i === capacity) {
                break;
            }
            pages.push(i + 1);
        }
        setPagesToDisplay(pages);
    }, [perPage]);

    function handlePageClick(page: number) {
        dispatch(setTake(perPage * page));
        dispatch(setSkip((page - 1) * perPage));
        setActivePage(page);
    }

    useEffect(() => {
        let arr: number[] = pagesToDisplay;
        if ((activePage - 1) === arr[arr.length - 1]) {
            arr = arr.slice(initialCapacity + 1);
            arr.push(activePage);
            for (let i = activePage + 1; i <= activePage + initialCapacity; i++) {
                arr.push(i);
            }
            setPagesToDisplay(arr);
        }
        if (activePage < arr[0]) {
            const left: number[] = [];
            for (let i = activePage - initialCapacity; i < activePage; i++) {
                left.push(i);
            }
            left.push(activePage);
            arr = arr.slice(0, initialCapacity);
            setPagesToDisplay(left.concat(arr));
        }
    }, [activePage]);

    useEffect(() => {
        if (take === perPage && skip === 0) {
            setActivePage(1);
        }
    }, [take, skip]);

    return (
        <div className="pages-wrapper" style={{ bottom: `${bottom && bottom}` }}>
            <button className={`arrow-wrapper left-arrow ${skip == 0 ? 'inactive' : ''}`} disabled={skip == 0} onClick={() => {
                dispatch(setTake(take - perPage))
                dispatch(setSkip(skip - perPage))
                setActivePage(prevState => prevState - 1);
            }}></button>

            {pagesToDisplay.map((page, index) => (
                <div className={`${page === activePage ? 'active-page' : ''}`} onClick={() => handlePageClick(page)} key={index}>
                    <span style={{ color: `${page === activePage ? 'white' : 'black'}` }}>{page}</span>
                </div>
            ))
            }

            <button className={`arrow-wrapper right-arrow ${take >= extensions?.count! ? 'inactive' : ''}`} disabled={take >= extensions?.count!} onClick={() => {
                dispatch(setTake(take + perPage))
                dispatch(setSkip(skip + perPage))
                setActivePage(prevState => prevState + 1);
            }}></button>
        </div>
    );
};

export default Pager;
