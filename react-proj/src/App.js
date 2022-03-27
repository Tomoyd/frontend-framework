import "./App.css";
import {
  InheritanceInversionComponent,
  PropProxyComponent,
} from "./demos/higher-component";

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <PropProxyComponent />
        <InheritanceInversionComponent></InheritanceInversionComponent>
      </header>
    </div>
  );
}

export default App;
