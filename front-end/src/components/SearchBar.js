import React from "react";

export default function SearchBar({
  searchValue,
  handleInputChange,
  handleSearch,
  handleSearchClear,
  resetSearch,
}) {
  const searchOnEnter = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div>
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={searchOnEnter}
        placeholder="Search name or ID"
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleSearchClear}>Clear</button>
      <button onClick={resetSearch}>Reset</button>
    </div>
  );
}