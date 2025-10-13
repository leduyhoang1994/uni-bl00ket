import { CPagination, CPaginationItem } from "@coreui/react";

const UniPagination = ({
  page,
  total_page,
  onChange,
}: {
  page: number;
  total_page: number;
  onChange?: (page: number) => void;
}) => {
  if (total_page <= 1) return null;
  const go = (p: any) => p >= 1 && p <= total_page && onChange?.(p);
  const nums = [];

  if (total_page <= 7) {
    for (let i = 1; i <= total_page; i++) nums.push(i);
  } else {
    if (page > 3) nums.push(1, "...");
    for (
      let i = Math.max(1, page - 1);
      i <= Math.min(total_page, page + 1);
      i++
    )
      nums.push(i);
    if (page < total_page - 2) nums.push("...", total_page);
  }

  return (
    <CPagination align="center" className="mt-3">
      <CPaginationItem disabled={page === 1} onClick={() => go(page - 1)}>
        Previous
      </CPaginationItem>

      {nums.map((n, i) =>
        n === "..." ? (
          <CPaginationItem key={i} disabled>
            …
          </CPaginationItem>
        ) : (
          <CPaginationItem key={n} active={n === page} onClick={() => go(n)}>
            {n}
          </CPaginationItem>
        )
      )}

      <CPaginationItem
        disabled={page === total_page}
        onClick={() => go(page + 1)}
      >
        Next
      </CPaginationItem>
    </CPagination>
  );
};

export default UniPagination;
