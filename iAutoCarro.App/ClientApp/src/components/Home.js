import React, { Component } from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',        
        marginRight: '-50%',     
        'z-index': '50 important!',
        transform: 'translate(-50%, -50%)'        
    }

};

const loadingStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '100%',
        height: '100%',        
        marginRight: '-50%',
        'z-index': '60 important!',
        transform: 'translate(-50%, -50%)'
    }

};



export class Home extends Component {
    displayName = Home.name

    constructor(props) {
        super(props);
        this.state = {
            buses: [], loading: false, input: '', used: false, modalIsOpen: false, modalMessage: null,
            errors: {} };

        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.queryBusInfo = this.queryBusInfo.bind(this);
        this.render = this.render.bind(this);        
        this.queryBusInfo = this.queryBusInfo.bind(this);

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);        
    }

    openModal(message) {
        this.setState({ modalIsOpen: true, modalMessage: message });
    }

    afterOpenModal() {
    }

    closeModal() {
        this.setState({ modalIsOpen: false, loading: false });
    }

    handleValidation() {
        let input = this.state.input;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!input) {
            formIsValid = false;
            errors["codigo"] = "Bus Stop Code cannot be empty";

            this.openModal(2);
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChange(e) {
        this.setState({ input: e.target.value });
    }
    
    queryBusInfo() {

        if (this.handleValidation()) {
            let oldValue = this.state.input;
            

            this.setState({ buses: [], loading: true, input: oldValue });

            this.requestBusInfo();
        }
    }

    requestBusInfo = async () => {


        const response = await fetch('/api/RequestBusInfo?codigo=' + this.state.input)
            .then(response);


        let json = response.json();
        if (response.status !== 200) {
            json.then(error => {
                this.setState({ errors: error });
                this.openModal(2);
                this.setState({ buses: [], loading: false, used: true });
            })
        } else {
            json.then(json => {
                this.setState({ buses: json, loading: false, used: true });
            })
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
    
    render() {
        let contents = this.state.loading
            ? ""
            : this.state.used && this.state.buses.length > 0
                ? Home.renderBusesTable(this.state.buses)
                : this.state.used ? <span style={{ color: "red" }}>No records were found</span> : "";

        return (

            <div>
                <div class="divForm">
                        <h3>Hello, world!</h3>
                        <p>Welcome to your autocarro STCP Porto Portugal real time tracking app</p>
                        <p>To help you get started, please insert your <b>bus stop code</b>:</p>
                    <div class="input-group input-group-lg divForm">
                       
                        <input ref="codigo" type="text" class="form-control form-control-lg" onChange={this.handleChange} id="codigo" value={this.state.input} placeholder="Example: LION1" />
                    
                        <div class="row"></div>
                                <div class="input-group-btn">
                            <button class="btn btn-default" onClick={this.openModal}>
                                    <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
                                    </button>
                                </div>
                        </div>
                
                    <button onClick={this.queryBusInfo} disabled={this.state.loading} class="btn btn-primary btn-lg btn-block">Go!</button>
                   
                      <div>
                          {contents}
                    </div>
                </div>


                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel=""
                >

                    {

                        this.state.modalMessage == 2 ?

                            <span style={{ color: "red" }}>{this.state.errors["codigo"]}</span>
                            :
                            <div class="modal-content">
                                <p><img src="examplebusstopcode.png" /></p>
                            </div>

                    }

                </Modal>

                <Modal
                    isOpen={this.state.loading}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={loadingStyle}
                    class='modalLoading'
                >
                    <div id="loading">
                        <ul class="bokeh">
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                </Modal>
            </div>      


          
    );
  }
}
