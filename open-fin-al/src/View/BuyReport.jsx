// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.


import React, { Component } from "react";

class BuyReport extends Component {
    constructor(props){
        super(props);

        this.state = {cik: '', form: '', start: '', end: ''};

        this.handleChangeCIK = this.handleChangeCIK.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeCIK(event){
        this.setState({cik: event.target.value});
    }

    handleChangeForm(event){
        this.setState({form: event.target.value});
    }

    handleChangeStart(event){
        this.setState({start: event.target.value});
    }

    handleChangeEnd(event){
        this.setState({end: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();
    }
    render() {
        return (
            <div className="page">
                <h2>Buy Report</h2>

                <form onSubmit={this.handleSubmit}>
                    <label for="CIKNum">CIK Number: </label>
                    <input type="text" id="CIKNum" name="CIKNum" value={this.state.cik} onChange={this.handleChangeCIK}/><br/><br/>

                    <input type="radio" id="10-K" name="filingType" value="10-K" checked={this.state.form === "10-K"} onChange={this.handleChangeForm}/>
                    <label for="10-K">10-K</label><br/>
                    <input type="radio" id="10-Q" name="filingType" value="10-Q" checked={this.state.form === "10-Q"}onChange={this.handleChangeForm}/>
                    <label for="10-Q">10-Q</label><br/><br/>

                    <label for="start">Start Date: </label>
                    <input type="date" id="start" name="start" value={this.state.start} onChange={this.handleChangeStart}/><br/>

                    <label for="end">End Date: </label>
                    <input type="date" id="end" name="end" value={this.state.end} onChange={this.handleChangeEnd}/><br/><br/>

                    <input type="submit" value="Submit"/>
                </form>

                <output form="companyForm" id="out" name="out" for="CIKNum"></output>

            </div>
        );
    }
}

export default BuyReport;
