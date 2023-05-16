import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Pagination as MuiPagination } from '@material-ui/lab';
import { Select, MenuItem } from '@material-ui/core';

import './style.scss';

const Pagination = ({
  totalSize, pageIndex, pageSize, setPageIndex, setPageSize,
}) => {
  const handleChangePageIndex = (e, newValue) => {
    setPageIndex(newValue - 1);
  };

  const handleChangePageSize = (e) => {
    setPageSize(e.target.value);
    setPageIndex(0);
  };

  const firstNo = useMemo(() => pageIndex * pageSize + 1, [pageIndex, pageSize]);
  const lastNo = useMemo(() => (Math.ceil(totalSize / pageSize) === (pageIndex + 1)
    ? totalSize
    : pageIndex * pageSize + pageSize),
  [totalSize, pageSize, pageIndex]);

  return (
    <div className="pagination-wrapper">
      <p className="result-info">
        {`Results: ${firstNo} - ${lastNo} of ${totalSize}`}
      </p>
      <MuiPagination
        count={Math.ceil(totalSize / pageSize)}
        shape="rounded"
        onChange={handleChangePageIndex}
      />

      <Select
        value={pageSize}
        onChange={handleChangePageSize}
      >
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={8}>8</MenuItem>
        <MenuItem value={12}>12</MenuItem>
      </Select>
    </div>
  );
};

Pagination.propTypes = {
  totalSize: PropTypes.number,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  setPageIndex: PropTypes.func,
  setPageSize: PropTypes.func,
};

Pagination.defaultProps = {
  totalSize: 0,
  pageIndex: 0,
  pageSize: 0,
  setPageIndex: () => {},
  setPageSize: () => {},
};

export default Pagination;