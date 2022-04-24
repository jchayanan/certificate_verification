import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Div = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  width: 100%;
`;

const Container = styled.div`
  position: relative;
  background-color: ${(props) => props.theme.colors.background};
  width: 32%;
  margin: 10% auto;`

const Header = styled.div`
  display: block;
  color: ${(props) => props.theme.colors.font};
  font-size: 50px;
  letter-spacing: 8px;
`;

const Subheader = styled.div`
  display: block;
  color: ${(props) => props.theme.colors.font2};
  font-size: 20px;
  margin-top: -10px;
  margin-bottom: 40px;
  letter-spacing: 5px;
`
const Paragraph = styled.div`
  display: inline-block;
  color: ${(props) => props.theme.colors.font};
  font-size: 20px;
  text-align: left;
  letter-spacing: 1px;
  `

const Button = styled.button`
  padding: 15px;
  font-weight: 700;
  border-radius: 5px;
  border: 0px solid;
  margin: 20px;
  background-color: #6371e5;
  color: #ffffff;
  transition: 0.3s;
  box-shadow: 4px 2px 16px -7px rgba(0,0,0,0.59);
  :hover {
    cursor: pointer;
    background-color: #ffffff;
    color:${(props) => props.theme.colors.font};
    border: 2px solid #6371e5;
    padding: 14px;
  }`

const StyledLink = styled(Link)`
    text-decoration: none;
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;



function Home() {
  return (
    <Div>
      <Container>
      <Header>Certificate System</Header>
      <Subheader>Using Ethereum Blockchain</Subheader>
      <Paragraph>A Decentralized Certificate Issuance and Verification System to create certificates that are Immutable, Cryptographically Secured, and have Zero Downtime. All powered by decentralized Ethereum Smart Contracts</Paragraph>
      <StyledLink className="left-button" to="/university"><Button>ISSUE CERTIFICATE</Button></StyledLink>
      <StyledLink className="right-button" to="/company"><Button>VIEW CERTIFICATE</Button></StyledLink>
      </Container>
    </Div>
  );
}

export default Home;