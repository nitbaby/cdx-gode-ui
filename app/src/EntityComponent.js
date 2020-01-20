import React from 'react';
import axios from 'axios';
import { ToastProvider, useToasts } from 'react-toast-notifications';
// const { addToast } = useToasts();
import Notifications, {notify} from 'react-notify-toast';
export default class EntityComponent extends React.Component {

  constructor(props) {
    super(props);
    const initEntityItem1 = {
      name: 'StudentId',
      description: 'For storing student roll number',
      datatype: 'Number',
      properties: ['INDEX', 'UNIQUE'],
      isEditing: false
    }

    const initEntityItem2 = {
      name: 'StudentName',
      description: 'For storing student name',
      datatype: 'String',
      properties: [],
      isEditing: true
    }

    this.state = {entityItems: [initEntityItem1, initEntityItem2]};
  }

  handleAddEntityItemClick() {
    console.log('this is:', this.state.jsonValue);
    const entityItems = this.state.entityItems;
    this.setState({
      entityItems: [
        ...entityItems,
        { name: '',
          description: '',
          datatype: '',
          properties: [],
          isEditing: true
        }
      ]
    })
  }

  toggleEntityEdit(item, i) {
    const entityItems = this.state.entityItems;
    const updatedItem = Object.assign({}, item, {isEditing: !item.isEditing});
    const updatedEntityList = entityItems.map((item, idx) => {
      if (idx === i) {
        return updatedItem;
      } else {
        return item
      }
    })
    this.setState({
      entityItems: updatedEntityList
    })

    console.log(item, i);
  }

  handleEntityItemChange(event, i, field) {
    const entityItems = this.state.entityItems;
    const item = entityItems[i];
    let updatedItem;
    if (field === 'name') {
      updatedItem = Object.assign({}, item, {name: event.target.value});
    } else if (field === 'description') {
      updatedItem = Object.assign({}, item, {description: event.target.value});
    } else if (field === 'datatype') {
      updatedItem = Object.assign({}, item, {datatype: event.target.value});
    }
    const updatedEntityList = entityItems.map((item, idx) => {
      if (idx === i) {
        return updatedItem;
      } else {
        return item
      }
    })
    this.setState({
      entityItems: updatedEntityList
    })
  }

  render() {
    const entityItems = this.state.entityItems;
    const tableRows = entityItems.map((item, idx) => {
      if (item.isEditing) {
        return (
          <tr key={idx}>
            <th scope="row">
              <input type="text" className="form-control" value={item.name}
                onChange={(e) => this.handleEntityItemChange(e, idx, 'name')} required/>
            </th>
            <td>
            <select className="form-control"
              onChange={(e) => this.handleEntityItemChange(e, idx, 'datatype')}
              value={item.datatype}>
              <option value="String">String</option>
              <option value="Number">Number</option>
              <option value="Boolean">Boolean</option>
            </select>
            </td>
            <td>
              <input type="text" className="form-control" value={item.description}
                onChange={(e) => this.handleEntityItemChange(e, idx, 'description')} required/>
            </td>
            <td>{item.properties.join(', ')}</td>
            <td>
              <button type="button" className="btn btn-primary"
                onClick={(e) => this.toggleEntityEdit(item, idx)}>
                  Save new entity item
              </button>
            </td>
          </tr>
        )
      } else {
        return (
          <tr key={idx}>
            <th scope="row">{item.name}</th>
            <td>{item.datatype}</td>
            <td>{item.description}</td>
            <td>{item.properties.join(', ')}</td>
            <td>
              <button type="button" className="btn btn-primary"
                  onClick={(e) => this.toggleEntityEdit(item, idx)}>
                    Edit entity item
              </button>
            </td>
          </tr>
        )
      }
    });


    return (
      <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Datatype</th>
            <th scope="col">Description</th>
            <th scope="col">Properties</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
      <button type="button" className="btn btn-primary" onClick={(e) => this.handleAddEntityItemClick(e)}>Add new entity item</button>
      </div>
    );
  }
}
