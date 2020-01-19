import React from 'react';
import axios from 'axios';
import { ToastProvider, useToasts } from 'react-toast-notifications';
// const { addToast } = useToasts();
import Notifications, {notify} from 'react-notify-toast';
export default class MainFormComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {jsonValue: ''};
  }

  handleSubmitClick() {

    console.log('this is:', this.state.jsonValue);
    const jsonValueToPost = this.state.jsonValue.trim().replace(/(\r\n|\n|\r)/gm, "");
    console.log('this is:', jsonValueToPost);
    axios.post('/user', {
      config: jsonValueToPost
    })
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

  handleJSONValueChange(event) {
    this.setState({jsonValue: event.target.value});
  }

  render() {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1">Configuration JSON</label>
          <textarea className="form-control"
            id="exampleFormControlTextarea1"
            rows="10"
            value={this.state.jsonValue}
            onChange={(e) => this.handleJSONValueChange(e)}>
          </textarea>
        </div>
        <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmitClick(e)}>Submit</button>
        <Notifications />
      </form>
    );
  }
}
