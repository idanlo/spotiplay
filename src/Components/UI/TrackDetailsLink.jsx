import { Link } from "react-router-dom";
import styled from "styled-components";

export const TrackDetailsLink = styled(Link)`
    color: hsla(0, 0%, 100%, 0.6);
    transition: color 0.2s linear;
    text-decoration: none;
    &:hover {
        border-bottom: 1px solid #fff;
        color: #fff;
    }
`;
