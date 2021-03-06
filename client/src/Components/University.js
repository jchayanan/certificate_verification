import React, { Component } from "react";
import Certification from "../contracts/Certification.json";
import getWeb3 from "../getWeb3";
import styled from "styled-components";
import Select from 'react-select';
import { v4 as uuidv4 } from "uuid";
import { encrypt } from "./encrypt.js";
import ipfs from '../ipfs'
import { Button, Div } from "../style/style";
import '../style/style.css';

const options = [
  { value: 'Srinakarinwirot University', label: 'Srinakarinwirot University', acronym: 'SWU' },
  { value: 'Chulalongkorn university', label: 'Chulalongkorn university', acronym: 'CU' },
  { value: 'Thammasat University', label: 'Thammasat University', acronym: 'TU' },
];

const customStyles = {
  singleValue:(provided) => ({
    ...provided,
    height:'100%',
    fontSize:'20px',
    indent:'15px'
  }),
}

export class University extends Component {
  constructor(props) {
    super(props);
    this.captureFile = this.captureFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitData = this.submitData.bind(this);
    this.validate = this.validate.bind(this);
    this.handleChangeSelected = this.handleChangeSelected.bind(this);
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      chainId: null,
      result: null,
      ipfsHash: null,
      certId: '',
      showId: '',
      firstname: '',
      lastname: '',
      university: '',
      acronym: '',
      course: '',
      buffer: null,
      issuer: null,
      errors: [],
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
    const chainId = await web3.eth.getChainId();
    this.setState({chainId: chainId})
    console.log(chainId)
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

  handleChange(event) {
    this.setState({
      // Computed property names
      // keys of the objects are computed dynamically
      [event.target.name]: event.target.value,
    });
    //console.log(event.target.name, event.target.value)
  }

  handleChangeSelected(selectedOption) {
    this.setState({ university : selectedOption.value }, () =>
      console.log(`Option selected:`, this.state.university)
    );
    this.setState({ acronym : selectedOption.acronym })
  };

  captureFile(e) {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  }

  refreshPage() {
    window.location.reload();
  }

  validate(name, lastname, university, acronym, course) {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (name.length === 0) {
      errors.push("Name can't be empty");
    }

    if (lastname.length === 0) {
      errors.push("Last name can't be empty");
    }
    if (university.length === 0) {
      errors.push("University can't be empty");
    }
    if (acronym.length === 0) {
      errors.push("Acronym can't be empty");
    }

    if (course.length === 0) {
      errors.push("Password can't be empty");
    }

    return errors;
  }

  submitData = async (e) => {
    e.preventDefault();
    const { firstname, lastname, university, acronym, course } = this.state;
    const errors = this.validate(firstname, lastname, university, acronym, course);
    console.log( firstname, lastname, acronym,)
    console.log(errors);
    if (errors.length === 0) {
      const { accounts, contract } = this.state;
      const d = new Date();
      const issuer = await contract.methods.getIssuer(accounts[4]).call();
      console.log(issuer);
      if (issuer === true) {
        if (this.state.buffer != null) {
          const result = await ipfs.files.add(this.state.buffer);
          const ipfsHash = await result[0].hash;
          this.setState({ ipfsHash: ipfsHash });
          console.log("ipfsHash", this.state.ipfsHash);
        }
        const certId = uuidv4();
        const fullName = `${this.state.firstname} ${this.state.lastname}`;
        console.log(
          this.state.firstname,
          this.state.lastname,
          this.state.university,
          this.state.acronym,
          this.state.course
        );
        await contract.methods
          .generateCertificate(
            certId,
            encrypt(fullName, certId),
            this.state.university,
            this.state.acronym,
            encrypt(this.state.course, certId),
            encrypt(
              `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`,
              certId
            ),
            encrypt(this.state.ipfsHash, certId)
          )
          .send({ from: accounts[0], gas: 3000000 })
          .then(
            (result) => {
              console.log("onSubmit...");
              alert("Upload successfully!");
              contract.getPastEvents("CertificateGenerated");
              console.log(certId);
              console.log(result.events.CertificateGenerated.returnValues);
              this.setState({certId : certId, showId: true})
            },
            (error) => {
              console.log(error);
            }
          );
        this.setState({
          firstname: "",
          lastname: "",
          university: "",
          acronym: "",
          course: "",
        });
        this.setState({errors: []})
      } else {
        alert("You are not allowed");
      }
    } else {
      this.setState({ errors });
      return;
    }
  };

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
    } else {
      const { errors } = this.state;
      const { selectedOption } = this.state;
      return (
        <Div>
          <Container>
            <Form className="university-form">
              <label htmlFor="firstname">Your name*</label>
              <input
                className="candidate-name-textfield"
                name="firstname"
                id="firstname"
                value={this.state.firstname}
                onChange={this.handleChange}
                placeholder="First Name"
                type="text"
                required
              />
              <input
                className="candidate-lastname-textfield"
                name="lastname"
                id="lastname"
                value={this.state.lastname}
                onChange={this.handleChange}
                placeholder="Last Name"
                type="text"
                required
              />
              <label htmlFor="university">University*</label>
              <StyledSelect
                value={options.find(obj => obj.value === selectedOption)}
                onChange={this.handleChangeSelected}
                options={options}
                styles={customStyles}
              />
              <label htmlFor="acronym">University Acronym*</label>
              <input
                className="form"
                name="acronym"
                id="acronym"
                value={this.state.acronym}
                onChange={this.handleChange}
                placeholder="Acronym"
                type="text"
                disabled="true"
                required
              />
              <label htmlFor="course">Course*</label>
              <input
                className="form"
                name="course"
                id="course"
                value={this.state.course}
                placeholder="Course"
                onChange={this.handleChange}
                type="text"
              />
              <label htmlFor="file">Certificate</label>
              <input
                className="input-file"
                id="file"
                type="file"
                onChange={this.captureFile}
              />
            </Form>
            <FormButton type="submit" onClick={this.submitData}>
              ISSUE CERTIFICATE
            </FormButton>
          </Container>
          <CertID style={{ display: this.state.showId ? "block" : "none" }}>
            Certificate ID {this.state.certId}
          </CertID>
          <div
            style={{ display: this.state.errors.length > 0 ? "block" : "none" }}
          >
            <Error>
              {errors.map((error) => (
                <p key={error}>Error: {error}</p>
              ))}
            </Error>
          </div>
        </Div>
      );
    }
  }
}

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  grid-template-rows: 50px 1fr 120px;
  background-color: #ffffff;
  width: 500px;
  height: 650px;
  margin: 0px auto;
  box-shadow: 4px 7px 24px -5px rgba(0,0,0,0.75);
  border-radius: 10px;
  @media (max-height: 868px) {
    grid-template-rows: 28px 450px;
    width: 450px;
    grid-template-columns: 35px 1fr 35px;
    height: 575px;
  }
  @media (max-width: 414px) {
    width: 320px;
    height: 560px;
  }`

const StyledSelect = styled(Select)`
  margin-bottom: 40px;
`;

const Form = styled.form`
  width: 100%;
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  text-align: left;
  `

const FormButton = styled(Button)`
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 3;
  grid-row-end: 4;
  height: 50px;
  `

const Error = styled.div`
  margin: -3% 0% 0% 15%;
  top: 170px;
  position: absolute;
  border-radius: 10px;
  padding: 20px;
  color: #bb7c00;
  border-style: solid;
  border-color: #ffc07c;
  background-color: #ffca5d52;
      @media (max-width: 1376px) {display: none;}
`;

const CertID = styled.div`
  box-shadow: 4px 7px 24px -5px rgb(0 0 0 / 75%);
  display: block;
  background-color: #ffffff;
  position: absolute;
  margin-top: 2px;
  padding: 10px;
  border-radius: 10px;
  left: 50%;
  transform: translate(-50%);
`;

export default University;
