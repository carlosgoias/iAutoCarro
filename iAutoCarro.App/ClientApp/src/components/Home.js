import React, { Component } from 'react';

export class Home extends Component {
    displayName = Home.name

    constructor(props) {
        super(props);
        this.state = { buses: [], loading: false, input: 'LION1' };

        this.handleChange = this.handleChange.bind(this);
        this.queryBusInfo = this.queryBusInfo.bind(this);
        this.render = this.render.bind(this);        
    }

    handleChange(e) {
        this.setState({ input: e.target.value });
    }
    
    queryBusInfo()
    {
        let oldValue = this.state.input;

        this.state = { buses: [], loading: true, input: oldValue };

        fetch('/api/RequestBusInfo?codigo=' + oldValue)
            .then(response => {
                let json = response.json();
                if (response.status !== 200) {
                    json.then(error => {
                        console.error(error);
                    })
                } else {
                    json.then(json => {
                        this.setState({ buses: json, loading: false });
                    })
                }
            });
    }

    static renderBusesTable(buses) {
        return (
            <table class='table'>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Line</th>
                        <th>Waiting Time</th>
                        <th>Estimated Time</th>
                    </tr>
                </thead>
                <tbody>
                    {buses.map(bus =>
                        <tr key={bus.id}>
                            <td>{bus.number}</td>
                            <td>{bus.line}</td>
                            <td>{bus.waitingTime}</td>
                            <td>{bus.estimatedTime}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Home.renderBusesTable(this.state.buses);

        return (
          
            <div>
                    <h1>Hello, world!</h1>
                    <p>Welcome to your autocarro real time tracking app</p>
                    <p>To help you get started, please insert your bus stop code:</p>
            
                        <div class="form-group">
                            <label for="codigo">Bus Stop</label>
                      <input type="text" class="form-control" onChange={this.handleChange} id="codigo" placeholder="LION1"/>
                         </div>
                            <div class="form-group">
                      <button onClick={this.queryBusInfo} class="btn btn-primary">Go!</button>
                  </div>
                  <div>
                      {contents}
                </div>
                           
            </div>
          
    );
  }
}
