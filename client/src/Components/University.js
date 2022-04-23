import React, { Component } from "react";
import Certification from "../contracts/Certification.json";
import getWeb3 from "../getWeb3";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { encrypt } from "./encrypt.js";
import ipfs from '../ipfs'
import { Button, Div } from "../style/style";
import '../style/style.css';

export class University extends Component {
  constructor(props) {
    super(props);
    this.captureFile = this.captureFile.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.submitData = this.submitData.bind(this)
    this.state = {
      storageValue: 0, 
      web3: null, 
      accounts: null, 
      contract: null, 
      result: null,
      ipfsHash: null,
      firstname: '',
      lastname: '',
      university: '',
      acronym: '',
      course: '',
      buffer: '',
      issuer: null,
      };
  }
  

  async componentDidMount(){
 
      // Get network provider and web3 instance.
      console.log('University Page loaded')
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()
      console.log(accounts)
      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = Certification.networks[networkId]
      console.log('University Page loaded after web3')
      const instance = new web3.eth.Contract(
        Certification.abi,
        deployedNetwork && deployedNetwork.address,
      )
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      const issuer = await this.isIssuer();
      this.setState({ issuer: issuer });
      console.log(this.state.issuer);
  };

  handleChange(event){
    this.setState({
      // Computed property names
      // keys of the objects are computed dynamically
      [event.target.name] : event.target.value
    })
    //console.log(event.target.name, event.target.value)
  }

  captureFile(e) {
    e.preventDefault()
    const file = e.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  refreshPage(){ 
    window.location.reload(); 
    console.log("clicked!1")
}

  async isIssuer() {
    const { accounts, contract } = this.state;
    const issuer = await contract.methods.getIssuer(accounts[0]).call()
    return issuer;
  }

  submitData = async (e) => {
    e.preventDefault();
    const { accounts, contract } = this.state;
    const d = new Date();
    const issuer = await contract.methods.getIssuer(accounts[0]).call()
    console.log(issuer)
    if (issuer == true) {
      const result = await ipfs.files.add(this.state.buffer)
      const ipfsHash = await result[0].hash;
      this.setState({ ipfsHash: ipfsHash});
      console.log("ipfsHash", this.state.ipfsHash);
      const certId = uuidv4();
      const fullName = `${this.state.firstname} ${this.state.lastname}`;
      console.log(this.state.firstname, this.state.lastname, this.state.university, this.state.acronym, this.state.course)
      await contract.methods
        .generateCertificate(
          certId,
          encrypt(fullName, certId),
          this.state.university,
          this.state.acronym,
          encrypt(this.state.course, certId),
          encrypt(`${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`, certId),
          encrypt(this.state.ipfsHash, certId),     
        )
        .send({ from: accounts[0], gas: 3000000 })
        .then(
          (result) => {
            console.log("onSubmit...");
            alert("Upload successfully!");
            contract.getPastEvents('CertificateGenerated');
            console.log(certId);
            console.log(result.events.CertificateGenerated.returnValues);
          },
          (error) => {
            console.log(error);
          },
        );
        this.setState({firstname: '', lastname: '', university: '', acronym: '', course: ''})
      } else {alert("You are not allowed");}
  }

  render() {
    if (!this.state.web3) {
      return (
      <Div>
        <img src={'/images/metamask.png'} style={{margin: '40px'}} alt="metamask logo" height="200" width="200" />
        <h1>Can not detect to Web3 Provider</h1>
        <h1>Please make sure you have connected to your wallet </h1>
        <h1>And refresh this page. </h1>
        <Button onClick={() => window.location.reload()} style={{width: 100, fontSize: 20}} >OK</Button>
      </Div>);
    }
    else if (!this.state.issuer) {
      return (<DelayedDiv>You are not permitted</DelayedDiv>)
    } else {return (
      <Div>
        <Container>
          <Form className="university-form">
            <label htmlFor="firstname">Your name*</label>
            <input className="candidate-name-textfield" name="firstname" id="firstname" value={this.state.firstname} onChange={this.handleChange} placeholder="First Name" type="text"/>
            <input className="candidate-lastname-textfield" name="lastname" id="lastname" value={this.state.lastname} onChange={this.handleChange} placeholder="Last Name" type="text"/>
            <label htmlFor="university">University*</label>
            <input className="form" name="university" id="university" value={this.state.university} onChange={this.handleChange} placeholder="University"type="text" />
            <label htmlFor="acronym" >University Acronym</label>
            <input className="form" name="acronym" id="acronym" value={this.state.acronym} placeholder="University Acronym" onChange={this.handleChange} type="text" />
            <label htmlFor="course">Course*</label>
            <input className="form" name="course" id="course" value={this.state.course} placeholder="Course" onChange={this.handleChange} type="text" />
            <label htmlFor="file">Certificate</label>
            <input className="input-file" id="file" type="file" onChange={this.captureFile}/>
          </Form>
          <FormButton type="submit" onClick={this.submitData} >ISSUE CERTIFICATE</FormButton>
        </Container>
      </Div>
    );}
  }
}

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  grid-template-rows: 50px 1fr 120px;
  justify-items: center;
  background-color: #ffffff;
  width: 500px;
  height: 650px;
  margin: 0px auto;
  box-shadow: 4px 7px 24px -5px rgba(0,0,0,0.75);
  border-radius: 10px;`

const Form = styled.form`
  width: 100%;
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  text-align: left;
  padding-left: 30px;
  `

const FormButton = styled(Button)`
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 3;
  grid-row-end: 4;
  height: 50px;`

const DelayedDiv = styled(Div)`
  animation: fadeInAnimation ease 1s;
            animation-iteration-count: 1;
            animation-fill-mode: forwards;
        @keyframes fadeInAnimation {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
          };
`;

export default University;
