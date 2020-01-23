import React from 'react';
import axios from 'axios';
import EntityComponent from './EntityComponent'
import Notifications, {notify} from 'react-notify-toast';
import $ from 'jquery';
export default class MainFormComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'DemoApp12',
      entities: [this.getEmptyEntity()],
      version: '1.0',
      port: '8090',
      store: {
        name: "wynss_dev_r22",
        password: "dev-user",
        type: "MYSQL",
        username: "dev-user"
      },
      processingBuild: false,
      processingDeploy: false
    };
  }

  getEmptyEntity(){
    const entityItemRow = {
      name: 'StudentId',
      description: 'Student roll number',
      datatype: 'String',
      properties: {
        index: false,
        unique: false,
        primaryKey: true
      }
    };
    return({
      name: 'Student',
      version: '1.0',
      tags: 'Best Performer, Least Performer',
      entityItems: [entityItemRow]
    });
};
  handleSubmitClick() {
    this.setState({processingBuild: true});
    const postUrl = 'http://localhost:8005/generator/build';
    const body = this.transformEntityForPost(this.state);
    axios.post(postUrl, body)
    .then(function (response) {
      const successColor = { background: '#00B300', text: "#FFFFFF" };
      notify.show('Build completed successfully!', 'custom', 2000, successColor);
      $('#collapseTwo').collapse('toggle');
      console.log(response);
    })
    .catch(function (error) {
      const errorColor = { background: '#aa1717', text: "#FFFFFF" };
      notify.show('Sorry, an error occured while building the app', 'custom', 2000, errorColor);
      console.log(error);
    })
    .finally(() => {
      this.setState({processingBuild: false})
    });
  }

  handleDeployClick() {
    this.setState({processingDeploy: true});
    const postUrl = 'http://localhost:8005/generator/deploy';
    const {name, version, port, store} = this.state;
    const body = {
      appName: name,
      version: version,
      port: port,
      store: {
        name: store.name,
        password: store.password,
        type: store.type,
        username: store.username
      }
    };
    axios.post(postUrl, body)
    .then(function (response) {
      const successColor = { background: '#00B300', text: "#FFFFFF" };
      notify.show('Deployment triggered successfully!', 'custom', 2000, successColor);
      $('#collapseThree').collapse('toggle');
      console.log(response);
    })
    .catch(function (error) {
      const errorColor = { background: '#aa1717', text: "#FFFFFF" };
      notify.show('Sorry, an error occured while deploy was triggered', 'custom', 2000, errorColor);
      console.log(error);
    })
    .finally(() => {this.setState({processingDeploy: false})});
  }

  transformEntityForPost(state) {
    const {entities} = this.state;
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
        version: entity.version,
        tags: entity.tags.split(',').map((tag) => tag.trim())
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
  handleDeployParamChange(event, item) {
    switch (item) {
      case 'port':
        this.setState({port: event.target.value});
        break;
      case 'storeName':
        this.setState({store: Object.assign({}, this.state.store, {name: event.target.value})});
        break;
      case 'storePass':
        this.setState({store: Object.assign({}, this.state.store, {password: event.target.value})});
        break;
      case 'storeType':
        this.setState({store: Object.assign({}, this.state.store, {type: event.target.value})});
        break;
      case 'storeUsername':
        this.setState({store: Object.assign({}, this.state.store, {username: event.target.value})});
        break;
      default:

    }
  }
  handleAddEntityClick(event) {
    this.setState({entities: [...this.state.entities, this.getEmptyEntity()]});
  }
  handleLinkClick(linkType) {
    switch (linkType) {
      case 'portal':
        window.open('http://localhost:8005/gode/applications', '_blank')
        break;
      case 'docs':
        const port = this.state.port;
        window.open(`http://localhost:${port}/swagger-ui.html`, '_blank')
        break;
      default:

    }

  }
  handleSaveSingleEntity(entity, index) {
    const entities = this.state.entities;
    const entitiesUpdated = entities.map((item, idx) => ((index === idx) ? entity : item));
    this.setState({entities: entitiesUpdated});
  }

  render() {
    const {name, version, port, store, entities, processingBuild, processingDeploy} = this.state;

    const entityComponents = entities.map((entity, index) => (
      <EntityComponent
        key={index}
        entity={entity}
        id={index}
        saveSingleEntity={(entityToSave) => {this.handleSaveSingleEntity(entityToSave, index)}}/>
    ))
    return (
      <div>
      <Notifications />
        <div id="accordion">
            <div className="card">
              <div className="card-header" id="headingOne">
                <h5 className="mb-0">
                  <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Build
                  </button>
                </h5>
              </div>

            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
              <div className="card-body">
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
                {this.state.processingBuild ? (
                  <div>Processing...</div>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmitClick(e)}>Submit</button>
                )}
              </form>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header" id="headingTwo">
              <h5 className="mb-0">
                <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  Deploy
                </button>
              </h5>
            </div>
            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
              <div className="card-body">
                <div className="form-group">
                  <label>Port number</label>
                  <input className="form-control"
                    value={port}
                    onChange={(e) => this.handleDeployParamChange(e, 'port')}/>
                </div>
                <div className="form-group">
                  <label>Store name</label>
                  <input className="form-control"
                    value={store.name}
                    onChange={(e) => this.handleDeployParamChange(e, 'storeName')}/>
                </div>
                <div className="form-group">
                  <label>Store type</label>
                  <input className="form-control"
                    value={store.type}
                    onChange={(e) => this.handleDeployParamChange(e, 'storeType')}/>
                </div>
                <div className="form-group">
                  <label>Store username</label>
                  <input className="form-control"
                    value={store.username}
                    onChange={(e) => this.handleDeployParamChange(e, 'storeUsername')}/>
                </div>
                <div className="form-group">
                  <label>Store password</label>
                  <input className="form-control"
                    value={store.password}
                    onChange={(e) => this.handleDeployParamChange(e, 'storePass')}/>
                </div>
                {this.state.processingDeploy ? (
                  <div>Processing...</div>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={(e) => this.handleDeployClick(e)}>Deploy</button>
                )}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header" id="headingThree">
              <h5 className="mb-0">
                <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  API Doc & Admin Portal
                </button>
              </h5>
            </div>
            <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
              <div className="card-body">
                  <div>
                    <button type="button" className="btn btn-primary"
                      onClick={(e) => this.handleLinkClick('portal')}>Link to Admin Portal</button>

                    <button type="button" className="btn btn-primary ml-5"
                      onClick={(e) => this.handleLinkClick('docs')}>Link to API Docs</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
