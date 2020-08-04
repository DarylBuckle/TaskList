import React from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";
import { withRouter } from 'react-router-dom';
import AppMenu from './Components/AppMenu/AppMenu';
import Nav from './Components/AppMenu/Nav';
import TaskList from './Pages/TaskList';

const Root = "/tasks";
const BrokenLink = <div className="container" style={{marginTop:"30px"}}>
                      Oops, looks like you've found a broken link. This page does not exist or is still under construction.
                    </div>

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevScrollpos: window.pageYOffset,
      navvisible: true
    };
  }

  componentDidMount() {
    //window.addEventListener("scroll", this.handleScroll.bind(this)); //n/a

    //browsed to root, redirect to tasks page
    if (this.props.location.pathname === "/"){
      this.props.history.push({
        pathname: Root,
        search: ""
      });
    }
  }
  
  componentWillUnmount() {
    //window.removeEventListener("scroll", this.handleScroll.bind(this)); //n/a
  }

  handleScroll() {
    const { prevScrollpos } = this.state;
  
    const currentScrollPos = window.pageYOffset;
    const navvisible = prevScrollpos > currentScrollPos;
  
    this.setState({
      prevScrollpos: currentScrollPos,
      navvisible
    });
  };

  render(){
    return (
        <div className="App">
          <Switch>
            <Route path="/">
              <div>
                <div className={this.state.navvisible?"Body":"Body navbar--hidden"}> 
                  <nav 
                    className={this.state.navvisible?"navbar":"navbar navbar--hidden"}
                  >
                    <Nav />
                  </nav>
                  <AppMenu />
                  <div className="main">
                    <Switch>
                      <Route path="/tasks" component={TaskList}/> {/* if at /tasks show TaskList*/}
                      <Route path="/">
                        {BrokenLink} {/* Route not matched - show 404 page*/}
                      </Route>
                    </Switch>
                  </div>
                </div>
              </div>          
            </Route>
          </Switch>
        </div>
    );
  }
}

export default withRouter(App);
