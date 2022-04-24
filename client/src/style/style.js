import styled from 'styled-components';

export const Button = styled.button`
  padding: 15px;
  font-weight: 700;
  position: relative;
  border-radius: 5px;
  border: 0px solid;
  margin: 20px;
  background-color: #6371e5;
  color: #ffffff;
  transition: 0.3s;
  box-shadow: 4px 2px 16px -7px rgba(0, 0, 0, 0.59);
  :hover {
    cursor: pointer;
    background-color: #ffffff;
    color: ${(props) => props.theme.colors.font};
    border: 2px solid #6371e5;
    padding: 14px;
  }
`;

export const Div = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  width: 100%;
  margin-top: 100px;
  animation: fadeInAnimation ease 0.5s;
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
  `