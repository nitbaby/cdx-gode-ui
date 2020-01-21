import React from 'react';
import axios from 'axios';
import EntityComponent from './EntityComponent'
import { ToastProvider, useToasts } from 'react-toast-notifications';
// const { addToast } = useToasts();
import Notifications, {notify} from 'react-notify-toast';
export default class MainFormComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'Demo app',
      entities: [this.getEmptyEntity()],
      version: '1.0'
      };
  }

  getEmptyEntity(){
    const entityItemRow = {
      name: '',
      description: '',
      datatype: 'String',
      properties: {
        index: false,
        unique: false,
        primaryKey: false
      }
    };
    return({
      name: '',
      version: '1.0',
      entityItems: [entityItemRow]
    });
};
  handleSubmitClick() {

    console.log('this is:', this.state);
    const body = this.transformEntityForPost(this.state);
    // const jsonValueToPost = this.state.jsonValue.trim().replace(/(\r\n|\n|\r)/gm, "");
    console.log('body is:', body);
    axios.post('/user', body)
    .then(function (response) {
      const successColor = { background: '#00B300', text: "#FFFFFF" };
      notify.show('Saved Successfully!', 'custom', 2000, successColor);
      console.log(response);
    })
    .catch(function (error) {
      const errorColor = { background: '#aa1717', text: "#FFFFFF" };
      notify.show('Sorry, an error occured while saving', 'custom', 2000, errorColor);
      console.log(error);
    });
  }

  transformEntityForPost(state) {
    const {entities} = this.state;
    debugger;
    const entitiesToPost = entities.map((entity) => {
      const primaryKeyItem = entity.entityItems.filter((item) => item.properties.primaryKey)[0];
      const nonPrimaryKeyItems = entity.entityItems.filter((item) => !item.properties.primaryKey);
      const attributes = nonPrimaryKeyItems.map((item) => {
        const properties = [];
        if (item.properties.index) {
          properties.push('INDEX')
        }
        if (item.properties.unique) {
          properties.push('UNIQUE')
        }
        return ({
          datatype: item.datatype,
          description: item.description,
          name: item.name,
          properties
        });
      });
      let idField;
      if (primaryKeyItem) {
        idField = {
          datatype: primaryKeyItem.datatype,
          description: primaryKeyItem.description,
          name: primaryKeyItem.name
        };
      }
      return ({
        attributes,
        idField,
        name: entity.name,
        version: entity.version
      })
    })

    const postBody = {
      name: state.name,
      version: state.version,
      entities: entitiesToPost
    }
    return postBody;
  }

  handleAppNameChange(event) {
    this.setState({name: event.target.value});
  }
  handleVersionChange(event) {
    this.setState({version: event.target.value});
  }
  handleAddEntityClick(event) {
    this.setState({entities: [...this.state.entities, this.getEmptyEntity()]});
  }
  handleSaveSingleEntity(entity, index) {
    console.log(entity, index);
    const entities = this.state.entities;
    const entitiesUpdated = entities.map((item, idx) => ((index === idx) ? entity : item));
    this.setState({entities: entitiesUpdated});
  }

  render() {
    const {entities} = this.state;
    console.log('entities', entities);
    const entityComponents = entities.map((entity, index) => (
      <EntityComponent
        key={index}
        entity={entity}
        id={index}
        saveSingleEntity={(entityToSave) => {this.handleSaveSingleEntity(entityToSave, index)}}/>
    ))
    return (
      <form>
        <div className="form-group">
          <label htmlFor="appName"><h4>App Name</h4></label>
          <input className="form-control"
            id="appName"
            value={this.state.name}
            onChange={(e) => this.handleAppNameChange(e)}/>
        </div>
        <h4>Entities</h4>
        {entityComponents}
        <button type="button" className="btn btn-dark" onClick={(e) => this.handleAddEntityClick(e)}>Add Entity</button>
        <hr/>
        <div className="form-group">
          <label htmlFor="version"><h4>Version</h4></label>
          <input className="form-control"
            id="version"
            value={this.state.version}
            onChange={(e) => this.handleVersionChange(e)}/>
        </div>
        <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmitClick(e)}>Submit</button>
        <Notifications />
      </form>


    );
  }
}
