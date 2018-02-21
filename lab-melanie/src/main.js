'use strict';

// import './styles/reset.scss';
import './styles/main.scss';

import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL = 'https://www.reddit.com/r';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      limit: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  handleLimitChange(e) {
    this.setState({limit: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.update_state(this.state.value, this.state.limit);
  }

  render() {
    return (
      <form
        className={this.props.error ? 'form-error' : 'search-form'}
        onSubmit={this.handleSubmit}>

        <input
          type="text"
          name="reddit-topic"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Search for a Topic"/>

        <input
          type="number"
          max="100"
          name="search-limit"
          value={this.state.limit}
          onChange={this.handleLimitChange}
          placeholder="Limit To"/>
        <fieldset>
          <button type="submit">Search</button>
        </fieldset>
      </form>
    );
  }
}

class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="results">
        {this.props.results ?
          <section className="results-data">
            <h2>Results for {this.props.results.data.children[0].data.subreddit}</h2>
            <ul>
              {this.props.results.data.children.map((a, b) => {
                return <li key={b}>
                  <a href={a.data.url}><h3>{a.data.title}</h3><p>Ups: {a.data.ups}</p></a>
                </li>;
              })
              }
            </ul>
          </section>
          :
          undefined
        }

        {this.props.error ?

          <section className="results-error">
            <h2>You broke it.</h2>
          </section>
          :
          undefined
        }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchError: null,
    };
    this.searchApi = this.searchApi.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  updateState(name, limit) {
    this.searchApi(name, limit)
      .then(res => this.setState({results: res.body, searchError: null}))
      .catch(err => this.setState({results: null, searchError: err}));
  }

  searchApi(name, limit) {
    return superagent.get(`${API_URL}/${name}.json?limit=${limit}`);
  }

  render() {
    return (
      <div className="application">
        <h1>Search Reddit for Topics</h1>
        <h3>Enter the topic and limit results in the boxes below</h3>
        <SearchForm update_state={this.updateState} error={this.state.searchError}/>
        <Results results={this.state.results} error={this.state.searchError}/>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
