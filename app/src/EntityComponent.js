import React from 'react';
export default class EntityComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      entity: this.props.entity,
      id: this.props.id,
      isEditing: true
    };
  }

  handleAddEntityItemClick() {
    const entityItems = this.state.entity.entityItems;
    const updatedEntityItems = [
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
    ];

    this.setState({
      entity: Object.assign({}, this.state.entity, {
        entityItems: updatedEntityItems
      })
    });
  }

  handleEntityNameChange(event) {
    this.setState({
      entity: Object.assign({}, this.state.entity, {name: event.target.value})
    });
  }
  handleEntityVersionChange(event) {
    this.setState({
      entity: Object.assign({}, this.state.entity, {version: event.target.value})
    });
  }
  handleEntityTagsChange(event) {
    this.setState({
      entity: Object.assign({}, this.state.entity, {tags: event.target.value})
    });
  }
  handleEntityItemChange(event, i, field) {
    const entityItems = this.state.entity.entityItems;
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
      entity: Object.assign({}, this.state.entity, {entityItems: updatedEntityList})
    });
  }
  handleEditEntityClick(e) {
    this.setState({
      isEditing: true
    });
  }

  handleAddEntitySaveClick(e) {
    const entityItems = this.state.entity;
    this.setState({
      isEditing: false
    });
    this.props.saveSingleEntity(entityItems);
  }

  render() {
    const {entity, isEditing, id} = this.state;
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
    const tableRows = entity.entityItems.map((item, idx) => {
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
              <option value="Long">Long</option>
              <option value="Boolean">Boolean</option>
              <option value="BigDecimal">BigDecimal</option>
              <option value="BigInteger">BigInteger</option>
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

    const tagsBadges = entity.tags.split(',').map((tag, index) => (
      <span className="badge badge-pill badge-dark p-2 mr-2" key={index}>{tag}</span>
    ));

    let tagsToDisplay;
    if (isEditing) {
      tagsToDisplay = <input className="form-control" id="tags"
        value={entity.tags} onChange={(e) => this.handleEntityTagsChange(e)}/>
    } else {
      tagsToDisplay = <div>{tagsBadges}</div>;
    }
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label htmlFor="appName">Entity name</label>
              <input className="form-control"
                id="appName"
                value={entity.name}
                onChange={(e) => this.handleEntityNameChange(e)}/>
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label htmlFor="appName">Entity version</label>
              <input className="form-control"
                id="appName"
                value={entity.version}
                onChange={(e) => this.handleEntityVersionChange(e)}/>
            </div>
          </div>
        </div>
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
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
        <div className="form-group">
          <label>Tags</label>
          {tagsToDisplay}
        </div>
        <button type="button" className="btn btn-secondary float-right" onClick={(e) => this.handleAddEntityItemClick(e)}>Add new row</button>
        {editSaveButton}
        <hr/>
      </div>
    );
  }
}
