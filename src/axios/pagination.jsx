import React from "react";
import propTypes from "prop-types";
import _ from "lodash";

const Pagination = (props) => {
  const { totalItem, pageSize, onPageChange, currentPage } = props;

  const pageCount = Math.ceil(totalItem / pageSize);
  if (pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1);

  return (
    <ul className="pagination">
      {pages.map((page) => {
        return (
          <li
            key={page}
            className={page === currentPage ? "page-item active" : "page-item"}
          >
            <a className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
Pagination.propTypes = {
  totalItem: propTypes.number.isRequired,
  pageSize: propTypes.number.isRequired,
  currentPage: propTypes.number.isRequired,
  onPageChange: propTypes.func.isRequired,
};
export default Pagination;
