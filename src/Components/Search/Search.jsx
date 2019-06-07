import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import SearchInput from './SearchInput/SearchInput';
import SearchResults from './SearchResults/SearchResults';
import { Grid } from '@material-ui/core';

class Search extends Component {
  state = {
    query: '' // used for the search input, updated every keystroke
  };

  componentDidMount() {
    if (this.props.match.params.query) {
      const { query } = this.props.match.params;
      this.setState({ query });
    }
    this.props.setBackgroundImage(
      'linear-gradient(rgb(58, 91, 95), rgb(6, 9, 10) 85%)'
    );
    document.title = 'React Spotify | Search';
  }

  queryChangedHandler = e => {
    const { value } = e.target;
    this.setState({ query: value });
  };

  formSubmittedHandler = e => {
    e.preventDefault();
    const { query } = this.state;
    this.props.history.push('/search/results/' + query);
  };

  render() {
    return (
      <Grid container style={{ margin: 0, width: '100%' }}>
        <SearchInput
          queryChanged={this.queryChangedHandler}
          formSubmitted={this.formSubmittedHandler}
          value={this.state.query}
        />
        {this.props.match.params.query ? <SearchResults /> : null}
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setBackgroundImage: backgroundImage =>
      dispatch({
        type: actionTypes.SET_BACKGROUND_IMAGE,
        backgroundImage
      })
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Search)
);
