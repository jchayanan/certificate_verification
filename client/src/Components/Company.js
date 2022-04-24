import React, {Component} from 'react'
import styled from 'styled-components'
import Certification from "../contracts/Certification.json";
import getWeb3 from "../getWeb3";
import { decrypt } from "./decrypt";
import { Button, Div } from "../style/style";
import { ClapSpinner } from "react-spinners-kit";
import ReactModal from 'react-modal';

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
 
    // Get network provider and web3 instance.
    console.log('Company Page loaded')
    const web3 = await getWeb3()

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
    this.setState({ web3, contract: instance })
    console.log(this.state.contract)

  };

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
    try {
      const certificate = await contract.methods.getCertificate(certId).call();
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
            <h2>Company</h2>
            <p style={{ fontWeight: 100 }}>
            You may key in the certificate id to view the Verified Certificate created on the Credentials Ethereum Blockchain
            </p>
          </Header>
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
        <ReactModal
          isOpen={this.state.showModal}
          ariaHideApp={false}
          contentLabel={"Modal"}
          className="modal"
          overlayClassName="modal-overlay"
          onRequestClose={this.handleCloseModal}
        >
          <h1 style={{paddingLeft: 97}} >Cerrtificate</h1>
          <div className="modal-grid">
            <div className="candidate-name">
              <h4>Name</h4>
              <p>{this.state.name}</p>
            </div>
            <div className="course">
              <h4>Course Name</h4>
              <p>{this.state.course}</p>
            </div>
            <div className="university">
              <h4>University Name</h4>
              <p>{this.state.university}</p>
            </div>
            <div className="university-acronym">
              <h4>University Acronym</h4>
              <p>SWU</p>
            </div>
            <div className="date">
              <h4>Date</h4>
              <p>{this.state.date}</p>
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
          <h1>Certificate Verified✅</h1>
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
  box-shadow: 4px 7px 24px -5px rgba(0,0,0,0.75);
  border-radius: 10px;
  text-align: left;
`

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
  margin-bottom: 20px
`;

export default Company