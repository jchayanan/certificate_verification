import React, { Component } from 'react';
import styled from 'styled-components/';
import { Button, Div } from "../style/style";
import getWeb3 from "../getWeb3";
import Certification from "../contracts/Certification.json";

export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.submitAddress = this.submitAddress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      accounts: null,
      web3: null,
      contraacts: null,
      address: "",
    };
  }

  async componentDidMount() {
    // Get network provider and web3 instance.
    console.log("University Page loaded");
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Certification.networks[networkId];
    console.log("University Page loaded after web3");
    const instance = new web3.eth.Contract(
      Certification.abi,
      deployedNetwork && deployedNetwork.address
    );
    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    this.setState({ web3, accounts, contract: instance });
  }

  submitAddress = async (e) => {
    e.preventDefault();
    const { accounts, contract } = this.state;
    const issuer = await contract.methods.getIssuer(accounts[0]).call()
    if(issuer === true){
      try {
        await contract.methods
        .issuerRegister(this.state.address)
        .send({ from: accounts[0], gas: 3000000 })
        .then(
          (result) => {
            console.log("onSubmit...");
            console.log(result.events.IssuerRegistered.returnValues);
          },
          (error) => {
            alert(error);
            console.log(error);
          }
        );
      } catch (error) {
        alert('Incorrect Adress');
        console.log(error);
      }
    } else {alert('You are not permitted');}
  };

  handleChange(event) {
    this.setState({
      // Computed property names
      // keys of the objects are computed dynamically
      [event.target.name]: event.target.value,
    });
    console.log(event.target.name, event.target.value);
    //console.log(event.target.name, event.target.value)
  }

  render() {
    if (!this.state.web3) {
      return (
        <Div>
          <img
            src={"/images/metamask.png"}
            style={{ margin: "40px" }}
            alt="metamask logo"
            height="200"
            width="200"
          />
          <h1>Can not detect to Web3 Provider</h1>
          <h1>Please make sure you have connected to your wallet </h1>
          <h1>And refresh this page. </h1>
          <Button
            onClick={() => window.location.reload()}
            style={{ width: 100, fontSize: 20 }}
          >
            OK
          </Button>
        </Div>
      );
    }
    return (
      <Div>
        <Container>
          <h1>Admin</h1>
          <p1>
            Add issuer by wallet address.
          </p1>
          <form className="issuer-form">
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Issuer Address"
              onChange={this.handleChange}
            />
          </form>
          <AdminButton onClick={this.submitAddress}>Submit</AdminButton>
        </Container>
      </Div>
    );
  }
}

const Container = styled.div`
  position: relative;
  display: block;
  justify-items: center;
  background-color: #ffffff;
  width: 500px;
  margin: 0px auto;
  padding: 50px 50px 40px 50px; 
  box-shadow: 4px 7px 24px -5px rgba(0,0,0,0.75);
  border-radius: 10px;
`;

const AdminButton = styled(Button)`
  position: relative;
  padding: 10px 20px 10px 20px;
  :hover { 
    padding: 8px 17px;
  }
`;