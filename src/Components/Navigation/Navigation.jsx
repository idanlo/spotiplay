import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { withRouter, NavLink } from "react-router-dom";
import styled from "styled-components";

const ContainerDiv = styled.div`
    width: ${props => (props.width ? props.width : `100%`)};
    margin: 0 auto;
`;

ContainerDiv.displayName = "ContainerDiv";

const StyledLink = styled(NavLink)`
    text-decoration: none;
    position: relative;
    color: grey;
    transition: color 0.2s;
    &:hover {
        color: #fff;
    }
    &.active {
        color: #fff;
        &::before {
            content: "";
            height: 2px;
            background-color: #1db954;
            width: 30px;
            position: absolute;
            bottom: -6px;
            display: block;
            left: 50%;
            margin-left: -15px;
        }
    }
`;

StyledLink.displayName = "StyledLink";

const StyledList = styled(List)`
    display: flex;
    flex-direction: row;
    padding: 0;
    margin: 0 auto;
`;

StyledList.displayName = "StyledList";

const StyledListItem = styled(ListItem)`
    && {
        text-align: center;
    }
`;

StyledListItem.displayName = "StyledListItem";

export const Navigation = props => (
    <ContainerDiv width={props.width}>
        <StyledList>
            {props.items && props.items.length > 0
                ? props.items.map(item => (
                      <StyledListItem key={item.text}>
                          <ListItemText>
                              <StyledLink to={item.link}>
                                  {item.text}
                              </StyledLink>
                          </ListItemText>
                      </StyledListItem>
                  ))
                : null}
        </StyledList>
    </ContainerDiv>
);

export default withRouter(Navigation);
