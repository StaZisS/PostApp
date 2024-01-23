import React from "react";
import s from "./Pagination.module.scss";

interface IPaginationProps {
    page: number;
    pageCount: number;
    size: number;
    onPageChange: (key: string, value: number) => void;
}

const Pagination = ({
                        page,
                        pageCount,
                        size,
                        onPageChange
                    }
                        : IPaginationProps) => {
    const [pageSize, setPageSize] = React.useState(size);
    const defaultPageSize = 4;

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = page - 1; i <= page + 1; i++) {
            if (i > 0 && i <= pageCount) {
                pageNumbers.push(i);
            }
        }
        return pageNumbers;
    };

    return (
        <div className={s.Pagination}>
            <div className={s.Pagination__buttons}>
                <button
                    onClick={() => onPageChange("page", page > 1 ? page - 1 : 1)}
                    disabled={page <= 1}
                >
                    &lt;
                </button>
                {generatePageNumbers().map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => onPageChange("page", pageNumber)}
                        className={pageNumber === page ? s.selectedPage : ""}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange("page", page < pageCount ? page + 1 : page)}
                    disabled={page >= pageCount}
                >
                    &gt;
                </button>
            </div>
            <div className={s.Pagination__input}>
                <input
                    value={pageSize || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value;
                        setPageSize(Number(inputValue));
                    }}
                    onBlur={() => onPageChange("size", pageSize || defaultPageSize)}
                />

            </div>

        </div>
    );
};

export default Pagination;
