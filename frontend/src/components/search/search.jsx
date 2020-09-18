// package imports
import React, { useState } from "react";

// css imports
import "./search.css";

function Search(props) {
    const [searchString, setSearchString] = useState("");
    const { onSearch } = props;

    return (
        <div className="search-container">
            <input
                className="search-input"
                type="text"
                placeholder="Search..."
                value={searchString}
                onChange={(e) => {
                    setSearchString(e.target.value);
                }}
            ></input>
            <button
                className="search-button"
                onClick={() => onSearch(searchString)}
            >
                Search
            </button>
        </div>
    );
}
export default Search;
