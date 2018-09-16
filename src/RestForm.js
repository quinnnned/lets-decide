import React from 'react';
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';


const getDefaultRoot = () => {
  const {protocol, host} = window.location;
  const port = protocol === "http:" ? ":3000" : ""
  return protocol+"//"+host+port+"/api/"
}

export default class RestForm extends React.Component {

  state = { 
    result: null,
    sending: false,
    error: null
  }

  handleSubmit = event => {
    event.preventDefault();
    const inputs = Array.from(event.target);
    const [root, path, methodValue, bodyValue] = inputs.map( x => x.value);
    inputs.forEach( (x, i) => { if (i) { x.value = "" } } );
    const method = methodValue.toUpperCase() || "GET";
    const body = method === "GET" ? undefined : bodyValue;

    this.setState({sending:true, result:null, error: null});
    fetch(root+path, {method, body})
      .then(getFullReponse)
      .then( result => this.setState({result}))
      .catch( error => this.setState({error}))
      .finally( () => this.setState({sending: false}))
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField fullWidth defaultValue={getDefaultRoot()} label="Root" />
          <br />
          <TextField label="Path" />
          <br />
          <br />
          <TextField select SelectProps={{native:true}}>
            {["GET", "POST", "PATCH", "DELETE"].map(method => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </TextField>
          <br />
          <TextField label="Body" />
          <br />
          <br />
          <Button color="primary" variant="contained" disabled={this.state.sending} type="submit">
            {this.state.sending ? "sending..." : "send"}
          </Button>
        </form>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {this.state.error && this.state.error.stack}
        </pre>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(this.state.result, null, 4)}
        </pre>
      </div>
    );
  }
}

const getFullReponse = res => res.text().then( text => {

  let body;

  try {
    body = JSON.parse(text);
  } catch (e) {
    body = text;
  }

  return {
    status: res.status,
    statusText: res.statusText,
    body
  }
})