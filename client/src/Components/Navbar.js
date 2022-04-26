import React, { Component } from "react";
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import getWeb3 from "../getWeb3";
import '../App.css'

class Navbar extends Component {

  state = {accounts: null, isConnected: false}

  async componentDidMount(){
 
    // Get network provider and web3 instance.
    console.log('University Page loaded')
    const web3 = await getWeb3()
    
    try {
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()
      this.setState({accounts: accounts[0], isConnected: true})
    } catch (error) {
      this.setState({accounts: " Not Connected ", isConnected: false,})
    }
};

  render() {
  return (
    <Nav>
        <StyledLink style={{fontWeight: "bold"}} to="/">Home</StyledLink>
        <StyledLink to="/university">University</StyledLink>
        <StyledLink to="/company">Company</StyledLink>
        <EndNav>
          <StyledLink style={{color: 'white'}} to="/admin">
          <span>💼</span>:{this.state.accounts}
          </StyledLink>
        </EndNav>
    </Nav>
  )
  }
}

const Nav = styled.nav`
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.font};
  font-size: 20px;
  display: flex;
  align-items: baseline;
  gap: 30px;
  list-style-type: none;
  padding: 15px 0px 20px 50px;
  box-shadow: 2px -24px 35px 8px rgb(0 0 0 / 75%)`

const StyledLink = styled(Link)`
    text-decoration: none;
    color: ${props => props.theme.colors.font};
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;

const EndNav = styled.div`
background-color: ${props => props.theme.colors.font};
color: ${props => props.theme.colors.background};
border-radius: 50px;
padding: 0px 15px 3px 15px;
  margin-left: auto;
  margin-right: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 414px) {
    display: none;
  }`


export default Navbar