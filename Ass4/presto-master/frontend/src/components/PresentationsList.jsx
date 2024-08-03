import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CardContainer = styled.div`
  display: grid;  
  font-family: Arial;

  @media screen and (min-width: 801px) {
    grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
  }
  @media screen and (max-width: 800px) {
    grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  }
`;

const PresentationName = styled.h3`
  margin-top: 0;
  margin-bottom: 0;
  color: black;
  @media screen and (max-width: 800px) {
    font-size: 2.8vw;
  }
  @media screen and (max-width: 500px) {
    font-size: 6vw;
  }
  @media screen and (min-width: 801px) {
    font-size: 1.8vw;
  }
`;

const PresentationDescription = styled.p`
  margin-top: 0;
  word-wrap: break-word;
`;

const SlideCount = styled.p`
  margin-bottom: 1vw;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  color: rgb(100, 100, 100);

  @media screen and (max-width: 800px) {
    width: 44vw;
    height: 22vw;
    font-size: 1.4vw;
    padding: 1.5vw;
    margin: 1.5vw;
  }
  @media screen and (max-width: 500px) {
    width: 92vw;
    height: 46vw;
    font-size: 3vw;
    padding: 2vw;
    margin: 2vw;
  }
  @media screen and (min-width: 801px) {
    width: 29.33vw;
    height: 14.67vw;
    font-size: 0.9vw;
    padding: 1vw;
    margin: 1vw;
  }
`;

const CardLink = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  text-decoration: none;
  color: inherit;
`;

const ThumbnailContainer = styled.div`
  width: 70%;
  height: 100%;
  background-color: ${({ src }) => (src ? 'transparent' : '#ccc')};
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
`;

const DetailsContainer = styled.div`
  width: 30%;
  height: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PresentationsList = ({ store }) => {
  if (store) {
    return (
      <CardContainer>
        {Object.values(store).map((presentation, index) => (
          <Card key={index}>
            <CardLink to={`/presentation/${presentation.id}/0`}>
              <ThumbnailContainer src={presentation.thumbnail}>
                {presentation.thumbnail && (
                  <Thumbnail src={presentation.thumbnail} alt="Thumbnail" />
                )}
              </ThumbnailContainer>
              <DetailsContainer>
                <PresentationName>{presentation.name}</PresentationName>
                <PresentationDescription>Description: <br></br>{presentation.description}</PresentationDescription>
                <SlideCount>Number of slides: {presentation.slideCount}</SlideCount>
              </DetailsContainer>
            </CardLink>
          </Card>
        ))}
      </CardContainer>
    );
  } else {
    return null;
  }
}

export default PresentationsList;
