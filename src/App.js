import './App.css';
import Faucet from './pages/Faucet';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Web3Wrapper from './web3/wrapper/Web3Wrapper';

function App() {

  const wrapperConfig = {
    infura: process.env.REACT_APP_INFURA,
    network: process.env.REACT_APP_NETWORK,
    rpc: process.env.REACT_APP_RPC,
    blockexplorer: { 
      url: process.env.REACT_APP_BLOCKEXPLORER_URL,
      name: process.env.REACT_APP_BLOCKEXPLORER_NAME
    },
    biconomy: 'true',
    biconomy_key: process.env.REACT_APP_BICONOMY_KEY,
    contract: process.env.REACT_APP_CONTRACT
  }

  return (
    <div className="App">
            <Web3Wrapper config={wrapperConfig}>
        <Router>
          <Switch>

            <Route exact path='/rinkeby-faucet'>
              <Faucet />
            </Route>

            <Route exact path='/'>
              <Faucet />
            </Route>


            
          </Switch>
        </Router>
      </Web3Wrapper>
    </div>
  );
}

export default App;
