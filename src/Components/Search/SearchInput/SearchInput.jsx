import React from "react";
import styled from "styled-components";

const SearchForm = styled.form`
    width: 100%;
    background-color: #282828;
    padding: 16px 0;
    margin-bottom: 16px;
`;

const SearchDiv = styled.div`
    padding: 0 2em;
    margin: 0 auto;
`;

const SearchTitle = styled.h4`
    font-weight: 400;
    color: #fff;
    margin-bottom: 0.5em;
`;

const SearchInputField = styled.input`
    width: 100%;
    font-size: 48px;
    font-weight: 600;
    color: #fff;
    background-color: transparent;
    border: none;
    outline: none;
`;

const SearchInput = props => (
    <SearchForm onSubmit={props.formSubmitted}>
        <SearchDiv>
            <SearchTitle>
                Search for an artist, Song, Album, or Playlist
            </SearchTitle>
            <SearchInputField
                spellCheck="false"
                type="text"
                value={props.value}
                placeholder="Search..."
                onChange={props.queryChanged}
            />
        </SearchDiv>
    </SearchForm>
);

export default SearchInput;
