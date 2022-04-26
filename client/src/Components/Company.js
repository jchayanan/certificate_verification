import React, {Component} from 'react'
import styled from 'styled-components'
import { decrypt } from "./decrypt";
import { Button, Div } from "../style/style";
import { ClapSpinner } from "react-spinners-kit";
import ReactModal from 'react-modal';
import Web3 from "web3"
import Certification from "../contracts/Certification.json";
const contract = require("@truffle/contract");
const CertificationInstance = contract(Certification);
const HDWalletProvider = require('@truffle/hdwallet-provider');

class Company extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.submitId = this.submitId.bind(this)
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.state = {
      web3: null,
      accounts: null, 
      contract: null, 
      certId: null,
      showModal: false,
      loading: true,
      name: '',
      university: '',
      acronym: '',
      course: '',
      ipfshash: '',
      date: '',
    }
  }

  async componentDidMount(){

    let web3 = new Web3(new HDWalletProvider({
      mnemonic: {
        phrase: 'coral thunder claim crisp rack goat roast crane monster turtle verify group'
      },
      providerOrUrl: "https://ropsten.infura.io/v3/4e5baf52beec44dd906ec5245fbe25dc"
    }))
    
    
    // Get network provider and web3 instance.
    console.log('Company Page loaded')
    CertificationInstance.setProvider(web3.currentProvider);
    console.log(CertificationInstance);
    console.log(web3.currentProvider);
  }

  handleChange(event){
    this.setState({
      // Computed property names
      // keys of the objects are computed dynamically
      [event.target.name] : event.target.value
    })
    console.log(event.target.name, event.target.value)
  }



  submitId = async (e) => {
    e.preventDefault();
    const { contract, certId } = this.state;
    console.log( contract )
    try {
      const certificate = await CertificationInstance.deployed().then((ins) => ins.getCertificate(certId))
      console.log(certificate);
      console.log("Name", decrypt(certificate[0], certId));
      console.log("University", certificate[1]);
      console.log("Acronym", certificate[2]);
      console.log("Course",  decrypt(certificate[3], certId));
      console.log("IPFS hash", decrypt(certificate[4], certId));
      console.log("Date of Issue", decrypt(certificate[5], certId));
      this.setState({name: decrypt(certificate[0], certId), university: certificate[1], acronym: certificate[2], course: decrypt(certificate[3], certId), ipfshash: decrypt(certificate[4], certId), date: decrypt(certificate[5], certId)})
      this.setState({ showModal: true})
    } catch (error) {
      console.log(error);
      alert("Incorrect certificate ID")
    }

    
  }

  handleOpenModal() {
    this.setState({ showModal: true})
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <Div>
        <Container>
          <Header>
            View Certificate
            </Header>
            <p style={{ fontWeight: 100 }}>
            You may key in the certificate id to view the Verified Certificate created on the Credentials Ethereum Blockchain
            </p>
          <form className="cert-id-form">
            <input
              className="cert-id"
              type="certId"
              id="certId"
              name="certId"
              placeholder="Certificate ID"
              onChange={this.handleChange}
            ></input>
          </form>
          <SectionButton>
            <ViewButton type="submit" onClick={this.submitId}>
              Submit
            </ViewButton>
          </SectionButton>
        </Container>
        <IdContainer>
          For Example Certificate : ed52f477-82b5-4b77-85e4-ee910a24d2ad
        </IdContainer>
        <ReactModal
          isOpen={this.state.showModal}
          ariaHideApp={false}
          contentLabel={"Modal"}
          className="modal"
          overlayClassName="modal-overlay"
          onRequestClose={this.handleCloseModal}
        >
          <div style={{fontSize: 40, fontWeight: 600}} >Cerrtificate</div>
          <hr></hr>
          <div className="modal-grid">
            <div className="candidate-name">
              <SubHeader>Name</SubHeader>
              {this.state.name}
            </div>
            <div className="course">
              <SubHeader>Course Name</SubHeader>
              {this.state.course}
            </div>
            <div className="university">
              <SubHeader>University Name</SubHeader>
              {this.state.university}
            </div>
            <div className="university-acronym">
              <SubHeader>University Acronym</SubHeader>
              {this.state.acronym}
            </div>
            <div className="date">
              <SubHeader>Date</SubHeader>
              {this.state.date}
            </div>
          <div className="modal-footer">
          <div className="ipfs-image">
          <a href={`https://ipfs.io/ipfs/${this.state.ipfshash}`} target="_blank" rel="noopener noreferrer">
          <div style={{ display: this.state.loading ? "block" : "none", margin: "50px", width: "30px", position: "absolute", marginLeft: 90, marginTop:60}}>
          <ClapSpinner color="#686769" />
          </div>
          </a>
          <a href={`https://ipfs.io/ipfs/${this.state.ipfshash}`} target="_blank" rel="noopener noreferrer">
          <img 
            src={`https://ipfs.io/ipfs/${this.state.ipfshash}`}
            alt="cer"
            onLoad={() => this.setState({loading: false})}
            onError={(event) => event.target.style.display = 'none'} />
          </a>
          </div>
          <div className="verify">
          <div style={{fontSize: 30, fontWeight: 400}}>Certificate Verified<span>✅</span></div>
          </div>
          </div>
          </div>
        </ReactModal>
      </Div>
    );}
}

const Container = styled.div`
  position: relative;
  justify-items: center;
  background-color: #ffffff;
  width: 500px;
  margin: 0px auto;
  padding: 50px 50px 40px 50px; 
  box-shadow: 5px 8px 29px -13px rgb(0 0 0 / 75%);
  border-radius: 10px;
  text-align: left;
  @media (max-width: 414px) {
    width: 300px;
  }
`


const IdContainer = styled(Container)`
  padding: 8px;
    margin-top: 30px;
    text-align: center;
    font-weight: 500;
`;

const ViewButton = styled(Button)`
  position: absolute;
  margin: 10px 0px 0px 0px;
  width: 100px;
  padding: 10px;
  :hover {
    margin: 10px 0px 0px 0px;
    padding: 8px;
  }
`

const SectionButton = styled.div`
  position: relative;
  width:100%;
  height: 50px;
`

const Header = styled.div`
  display: block;
  color: ${(props) => props.theme.colors.font};
  font-size: 30px;
  letter-spacing: 3px;
  font-weight: bold;
`;

const SubHeader = styled(Header)`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0px;
`;

export default Company