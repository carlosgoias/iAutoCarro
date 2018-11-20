import React, { Component } from 'react';

export class Home extends Component {
    displayName = Home.name

    constructor(props) {
        super(props);
        this.state = {
            buses: [], loading: false, input: '', used: false, modal: false,
            errors: {} };

        this.handleChange = this.handleChange.bind(this);
        this.queryBusInfo = this.queryBusInfo.bind(this);
        this.render = this.render.bind(this);        
        this.showImageExample = this.showImageExample.bind(this);

        let me = this;
        

        window.onclick = function (event) {
            let modal = document.getElementById('pictureModal');     

            if (event.target == modal) {               
                modal.style.display = "none";
                me.setState({ modal: true });
            }
        }
        
    }

    handleValidation() {
        let input = this.state.input;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!input) {
            formIsValid = false;
            errors["codigo"] = "Cannot be empty";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChange(e) {
        this.setState({ input: e.target.value });
    }
    
    queryBusInfo = async () =>
    {

        if (this.handleValidation()) {
            let oldValue = this.state.input;

            this.state = { buses: [], loading: true, input: oldValue };

            const response = await fetch('/api/RequestBusInfo?codigo=' + oldValue)
                .then(response);

            
            let json = response.json();
            if (response.status !== 200) {
                json.then(error => {
                    console.error(error);
                })
            } else {
                json.then(json => {
                    this.setState({ buses: json, loading: false, used: true});
                })
            }
        }
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

    showImageExample() {
        let modal = document.getElementById('pictureModal');        
        modal.style.display = "block"; 
        this.setState({ modal: true });
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.state.used && this.state.buses.length > 0
                ? Home.renderBusesTable(this.state.buses)
                : this.state.used ? <span style={{ color: "red" }}>No records were found</span> : "";

        return (
          
            <div>
                    <h1>Hello, world!</h1>
                    <p>Welcome to your autocarro real time tracking app</p>
                    <p>To help you get started, please insert your <b>bus stop code</b>:</p>
                   <div class="input-group input-group-lg">
                       
                    <input ref="codigo" type="text" class="form-control form-control-lg" onChange={this.handleChange} id="codigo" value={this.state.input} placeholder="Example: LION1" />
                        <span style={{ color: "red" }}>{this.state.errors["codigo"]}</span>
                            <div class="input-group-btn">
                                <button class="btn btn-default" onClick={this.showImageExample}>
                                <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
                                </button>
                            </div>
                    </div>
                
                <div id="pictureModal" class="modal">
                    
                    <div class="modal-content">
                        <p><img src="examplebusstopcode.png" /></p>
                    </div>

                </div>
                
                
                    <button onClick={this.queryBusInfo} class="btn btn-primary btn-lg btn-block">Go!</button>
                   
                  <div>
                      {contents}
                </div>
            </div>         
          
    );
  }
}
