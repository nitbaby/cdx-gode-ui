import React from 'react';
export default class EntityComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      entityItems: this.props.entity,
      id: this.props.id,
      isEditing: true
    };
  }
  
  handleAddEntityItemClick() {
    console.log('this is:', this.state.jsonValue);
    const entityItems = this.state.entityItems;
    this.setState({
      entityItems: [
        ...entityItems,
        { name: '',
          description: '',
          datatype: 'String',
          properties: {
            index: false,
            unique: false,
            primaryKey: false
          }
        }
      ]
    })
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
    } else if (field === 'index') {
      const properties = item.properties;
      const updatedProperties = Object.assign({}, properties, {index: event.target.checked});
      updatedItem = Object.assign({}, item, {properties: updatedProperties});
    } else if (field === 'unique') {
      const properties = item.properties;
      const updatedProperties = Object.assign({}, properties, {unique: event.target.checked});
      updatedItem = Object.assign({}, item, {properties: updatedProperties});
    } else if (field === 'primaryKey') {
      const properties = item.properties;
      const updatedProperties = Object.assign({}, properties, {primaryKey: event.target.checked});
      updatedItem = Object.assign({}, item, {properties: updatedProperties});
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
  handleEditEntityClick(e) {
    this.setState({
      isEditing: true
    });
  }

  handleAddEntitySaveClick(e) {
    const entityItems = this.state.entityItems;
    this.setState({
      isEditing: false
    });
    this.props.saveSingleEntity(entityItems);
  }

  render() {
    const {entityItems, isEditing, id} = this.state;
    let editSaveButton;
    if (isEditing) {
      editSaveButton = <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={(e) => this.handleAddEntitySaveClick(e)}>
                        Save entity
                      </button>
    } else {
      editSaveButton = <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={(e) => this.handleEditEntityClick(e)}>
                        Edit entity
                      </button>
    }
    const tableRows = entityItems.map((item, idx) => {
        return (
          <tr key={idx}>
            <th scope="row">
              <input type="text" className="form-control" value={item.name} disabled={!isEditing}
                onChange={(e) => this.handleEntityItemChange(e, idx, 'name')} required/>
            </th>
            <td>
            <select className="form-control" disabled={!isEditing}
              onChange={(e) => this.handleEntityItemChange(e, idx, 'datatype')}
              value={item.datatype}>
              <option value="String">String</option>
              <option value="Number">Number</option>
              <option value="Boolean">Boolean</option>
            </select>
            </td>
            <td>
              <input type="text" className="form-control" value={item.description} disabled={!isEditing}
                onChange={(e) => this.handleEntityItemChange(e, idx, 'description')} required/>
            </td>
            <td>
              <div className="form-group form-check inilne-blk mr-3">
                <input type="checkbox" className="form-check-input " id={`index-${id}-${idx}`} disabled={!isEditing}
                  checked={item.properties.index} onChange={(e) => this.handleEntityItemChange(e, idx, 'index')}/>
                <label className="form-check-label" htmlFor={`index-${id}-${idx}`}>Index</label>
              </div>
              <div className="form-group form-check inilne-blk mr-3">
                <input type="checkbox" className="form-check-input" id={`unique-${id}-${idx}`} disabled={!isEditing}
                  checked={item.properties.unique} onChange={(e) => this.handleEntityItemChange(e, idx, 'unique')}/>
                <label className="form-check-label" htmlFor={`unique-${id}-${idx}`}>Unique</label>
              </div>
              <div className="form-group form-check inilne-blk">
                <input type="checkbox" className="form-check-input" id={`primary-${id}-${idx}`} disabled={!isEditing}
                  checked={item.properties.primaryKey} onChange={(e) => this.handleEntityItemChange(e, idx, 'primaryKey')}/>
                <label className="form-check-label" htmlFor={`primary-${id}-${idx}`}>Primary Key</label>
              </div>
            </td>

          </tr>
        )
    });

    return (
      <div>
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Datatype</th>
              <th scope="col">Description</th>
              <th scope="col">Properties</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
        <button type="button" className="btn btn-secondary float-right" onClick={(e) => this.handleAddEntityItemClick(e)}>Add new row</button>
        {editSaveButton}
        <hr/>
      </div>
    );
  }
}
