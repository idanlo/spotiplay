import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Grid, CardContent, Typography, Fade } from '@material-ui/core';
// import PlayArrowIcon from '@material-ui/icons/PlayCircleFilled';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const PlayBtnContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: #1db954;
  border-radius: 50%;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.15);
  }
`;

PlayBtnContainer.displayName = 'PlayBtnContainer';

const PlayBtn = styled(PlayArrowIcon)`
  && {
    width: 60%;
    height: 60%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    color: #fff;
    transition: all 0.2s ease-in-out;
  }
`;

PlayBtn.displayName = 'PlayBtn';

const Content = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  font-weight: bold;
  color: #fff;
`;

Content.displayName = 'Content';

const Description = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  font-weight: 400;
  color: #7e7e7e;
`;

Description.displayName = 'Description';

const CardMedia = styled.div`
  border-radius: ${props => (props.rounded ? `50%` : null)};
  background-image: ${props => (props.img ? `url(${props.img})` : null)};
  padding-top: 100%;
  background-size: cover;
  position: relative;
`;

CardMedia.displayName = 'CardMedia';

// Stateless functional component to display a card in a grid,
// the component gets all data to show through props

const MediaCard = props => {
  const [hovered, setHovered] = React.useState(false);

  function playSongHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    if (props.playSong) {
      props.playSong();
    }
  }

  return (
    <Fade in>
      <Grid item md={1} sm={6} xs={12}>
        <div
          style={{
            backgroundColor: '#242424',
            padding: 10,
            position: 'relative',
            borderRadius: 8,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Link to={props.link} style={{ textDecoration: 'none' }}>
            <React.Fragment>
              <CardMedia rounded={props.rounded} img={props.img} />

              <CardContent>
                <Content
                  title={props.primaryText}
                  gutterBottom
                  variant="body1"
                  align={props.rounded ? 'center' : 'inherit'}
                >
                  {props.primaryText}
                </Content>
                <Description
                  title={props.secondaryText}
                  gutterBottom
                  variant="body1"
                  align={props.rounded ? 'center' : 'inherit'}
                >
                  {props.secondaryText}
                </Description>
              </CardContent>
            </React.Fragment>
          </Link>
          {hovered ? (
            <PlayBtnContainer>
              {props.playSong ? <PlayBtn onClick={playSongHandler} /> : null}
            </PlayBtnContainer>
          ) : null}
        </div>
      </Grid>
    </Fade>
  );
};

export default MediaCard;
