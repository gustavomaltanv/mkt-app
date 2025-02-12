import { Component } from "react";

class SubCard extends Component {
  render() {
    return (
      <div className='card md-3'>
        <h4 className='card-header'>{this.props.title}</h4>
        <div className='card-body'>{this.props.children}</div>
      </div>
    );
  }
}

export default SubCard;
