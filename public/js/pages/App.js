import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Footer from "../components/layout/Footer";
import Nav from "../components/layout/Nav";


class AppView extends React.Component {
  constructor() {
    super();
  }

  render() {
      const { location } = this.props;
      const containerStyle = {
          marginTop: "60px"
      };
    return (
        <div>
            <Nav location={location} />
            <div class="container" style={containerStyle}>
              <div class="row">
                <div class="col-lg-12">
                  {this.props.children}
                </div>
              </div>
            </div>
            <Footer/>
        </div>
    );
  }
}

export default connect(
  null,
  null,
)(AppView);
