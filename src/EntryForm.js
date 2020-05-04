import React from 'react';

export class EntryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Edit form needs the record data. empty for create form 
      name: this.props.record ? this.props.record.fields.Name : '',
      notes: this.props.record ? this.props.record.fields.Notes : ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.createRecord = this.createRecord.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
  }

  // handle multiple inputs
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();  
    const data = {
      name: this.state.name,
      notes: this.state.notes,
    }
    if (this.props.record) {
      data.recordId = this.props.record.id;
      this.updateRecord(data);
    }
    else {
      this.createRecord(data);
    }
  }

  createRecord(data) {
    fetch('/.netlify/functions/airtableCreate/airtableCreate.js', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(() => this.props.listRecords())
    .catch((error) => {
      console.error('Error:', error);
    });

    this.setState({
      name: '',
      notes: ''
    });
  }

  updateRecord(data) {
    fetch('/.netlify/functions/airtableUpdate/airtableUpdate.js', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(() => this.props.closeModal())
    .then(() => this.props.listRecords())
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col form-group">
            <label>Name</label>
            <input 
              name="name"
              type="text" 
              value={this.state.name} 
              onChange={this.handleInputChange} 
              className="form-control form-control-sm" />
          </div>  
          <div className="col form-group">
            <label>Notes</label>
            <input 
              name="notes"
              type="text" 
              value={this.state.notes} 
              onChange={this.handleInputChange} 
              className="form-control form-control-sm" />
          </div>     
          <div className="col form-group">
            <label>&nbsp;</label>
            <input type="submit" value="Save" className="btn btn-success btn-sm mb-2 form-control form-control-sm"/>
          </div> 
        </div>
      </form>
    );
  }
}