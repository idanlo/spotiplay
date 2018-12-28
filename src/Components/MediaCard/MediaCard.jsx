import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Grid, CardContent, Typography, Fade } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayCircleFilled";

const anim = keyframes`
    from {
        opacity: 0;
    }
    
    to {
        opacity: 1;
    }
`;

const CardHover = styled.div`
    border-radius: ${props => (props.rounded ? `50%` : null)};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: ${anim} 0.3s;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

CardHover.displayName = "CardHover";

const PlayBtn = styled(PlayArrowIcon)`
    && {
        width: 60px;
        height: 60px;
        color: #fff;
        transition: all 0.2s ease-in-out;
        &:hover {
            transform: scale(1.25);
        }
    }
`;

PlayBtn.displayName = "PlayBtn";

const Content = styled(Typography)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

Content.displayName = "Content";

const CardMedia = styled.div`
    border-radius: ${props => (props.rounded ? `50%` : null)};
    background-image: ${props => (props.img ? `url(${props.img})` : null)};
    padding-top: 100%;
    background-size: cover;
    position: relative;
`;

CardMedia.displayName = "CardMedia";

// Stateless functional component to display a card in a grid,
// the component gets all data to show through this.props

class MediaCard extends Component {
    state = {
        hovered: false
    };

    toggleHover = state => {
        this.setState({ hovered: state });
    };

    playSongHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.playSong) {
            this.props.playSong();
        }
    };

    render() {
        return (
            <Fade in>
                <Grid item md={2} sm={6} xs={12}>
                    <Link
                        to={this.props.link}
                        style={{ textDecoration: "none" }}
                    >
                        <React.Fragment>
                            <CardMedia
                                rounded={this.props.rounded}
                                onMouseEnter={() => this.toggleHover(true)}
                                onMouseLeave={() => this.toggleHover(false)}
                                img={this.props.img}
                            >
                                {this.state.hovered ? (
                                    <CardHover rounded={this.props.rounded}>
                                        {this.props.playSong ? (
                                            <PlayBtn
                                                onClick={this.playSongHandler}
                                            />
                                        ) : null}
                                    </CardHover>
                                ) : null}
                            </CardMedia>
                            <CardContent>
                                <Content
                                    title={this.props.content}
                                    gutterBottom
                                    variant="body1"
                                    align={
                                        this.props.rounded
                                            ? "center"
                                            : "inherit"
                                    }
                                >
                                    {this.props.content}
                                </Content>
                            </CardContent>
                        </React.Fragment>
                    </Link>
                </Grid>
            </Fade>
        );
    }
}

export default MediaCard;
