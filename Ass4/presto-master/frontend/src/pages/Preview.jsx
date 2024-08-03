import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import { Link, useParams, useNavigate } from 'react-router-dom';

const SlideshowContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const SlideContent = styled.div`
  display: ${({ currentIndex, index }) => (currentIndex === index ? 'flex' : 'none')};
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background: ${({ currentBackgroundColor, currentGradientColor, defaultBackgroundColor, defaultGradientColor }) => {
    if (currentGradientColor !== '') {
      return `linear-gradient(to bottom, ${currentBackgroundColor}, ${currentGradientColor})`;
    }
    if (currentBackgroundColor !== '') {
      return currentBackgroundColor;
    }
    if (defaultGradientColor !== '') {
      return `linear-gradient(to bottom, ${defaultBackgroundColor}, ${defaultGradientColor})`;
    }
    if (defaultBackgroundColor !== '') {
      return defaultBackgroundColor;
    }
    return 'white';
  }};
  opacity: ${({ isTransitioning }) => (isTransitioning ? 0 : 1)};
  transition: opacity 0.5s ease-in-out;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const BackButton = styled.div`
  position: absolute;
  font-family: Arial;
  top: 10px;
  left: 10px;
  z-index: 999;
`;

const StyledTextBox = styled.div`
  position: absolute;
  left: ${({ left }) => left}%;
  top: ${({ top }) => top}%;
  width: ${({ width }) => width}%;
  height: ${({ height }) => height}%;
  font-size: ${({ fontSize }) => fontSize}em;
  font-family: ${({ fontFamily }) => fontFamily};
  color: ${({ color }) => color};
  overflow: hidden;
  whiteSpace: nowrap;
`;

const StyledVideo = styled.div`
  position: absolute;
  left: ${({ left }) => left}%;
  top: ${({ top }) => top}%;
  width: ${({ width }) => width}%;
  height: ${({ height }) => height}%;
`;

const StyledImage = styled.div`
  position: absolute;
  left: ${({ left }) => left}%;
  top: ${({ top }) => top}%;
  width: ${({ width }) => width}%;
  height: ${({ height }) => height}%;
`;

const StyledCode = styled.div`
  position: absolute;
  left: ${({ left }) => left}%;
  top: ${({ top }) => top}%;
  width: ${({ width }) => width}%;
  height: ${({ height }) => height}%;
`;

const StyledPre = styled.pre`
  position: absolute;
  width: 100%;
  height: 100%;
  font-size: ${({ fontSize }) => fontSize}em;
  white-space: pre;
  background-color: #f5f5f5;
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

const SlideNumber = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 1em;
  color: grey;
`;

const ArrowDiv = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
`;

const ArrowImg = styled.img`
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: ${({ hide }) => hide ? 'none' : 'block'};
`;

const LanguageIndicator = styled.div`
  background-color: darkgrey;
`;

const CodeContent = styled.code`
  margin: 0;
  padding: 0;
`;

const detectLanguage = (code) => {
  const languages = ['javascript', 'python', 'c'];
  let maxRelevance = 0;
  let detectedLanguage = 'plaintext';

  languages.forEach((lang) => {
    const result = hljs.highlight(code, { language: lang, ignoreIllegals: true });
    if (result.relevance > maxRelevance) {
      maxRelevance = result.relevance;
      detectedLanguage = lang;
    }
  });

  return detectedLanguage;
};

const Preview = ({ token }) => {
  const currentUrl = window.location.href;
  const parts = currentUrl.split('/');
  const id = parts[parts.length - 2];
  const [store, setStore] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const { slideID } = useParams();
  const [isTransitioning, setIsTransitioning] = useState(false);

  try {
    React.useEffect(async () => {
      await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        setStore(response.data.store);
      });
    }, []);
  } catch (err) {
    console.log(err);
  }

  useEffect(() => {
    if (store && store[id] && store[id].slides) {
      const currentIndex = Object.keys(store[id].slides).findIndex(key => parseInt(key) === parseInt(slideID));

      if (currentIndex !== -1) {
        setCurrentSlideIndex(currentIndex);
      } else {
        navigate(`/preview/${id}/0`);
      }
    }
  });

  const handleNextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentSlideIndex < Object.values(store[id].slides).length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
        navigate(`/preview/${id}/${parseInt(slideID) + 1}`);
        setIsTransitioning(false);
      }
    }, 500);
  };

  const handlePreviousSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
        navigate(`/preview/${id}/${parseInt(slideID) - 1}`);
        setIsTransitioning(false);
      }
    }, 500);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' && store && store[id] && store[id].slides && currentSlideIndex < Object.values(store[id].slides).length - 1) {
      handleNextSlide();
    } else if (event.key === 'ArrowLeft' && currentSlideIndex > 0) {
      handlePreviousSlide();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  });

  return (
    <SlideshowContainer>
      <BackButton>
        <StyledLink to={`/presentation/${id}/${slideID}`}>
          Back
        </StyledLink>
      </BackButton>
      {store && store[id] && store[id].slides && Object.values(store[id].slides).map((slide, index) => (
        <SlideContent
          ref={null}
          key={slide.id}
          currentIndex={currentSlideIndex}
          index={index}
          isTransitioning={isTransitioning && currentSlideIndex === index}
          currentBackgroundColor={slide.currentBackgroundColor}
          currentGradientColor={slide.currentGradientColor}
          defaultBackgroundColor={store[id].defaultBackgroundColor}
          defaultGradientColor={store[id].defaultGradientColor}
        >
          {slide.textboxes.map((textbox) => (
            <StyledTextBox
              key={textbox.uuid}
              fontSize={textbox.fontSize}
              fontFamily={textbox.fontFamily}
              left={textbox.left}
              top={textbox.top}
              width={textbox.width}
              height={textbox.height}
              color={textbox.color}>
                {textbox.content}
              </StyledTextBox>
          ))}
          {slide.images.map((image) => (
            <StyledImage
              key={image.uuid}
              left={image.left}
              top={image.top}
              width={image.width}
              height={image.height}>
                <Image src={image.src} alt={image.alt} />
              </StyledImage>
          ))}
          {slide.videos.map((video) => (
            <StyledVideo
              key={video.uuid}
              left={video.left}
              top={video.top}
              width={video.width}
              height={video.height}>
                <iframe
                  width="100%"
                  height="100%"
                  src={video.src}
                  frameBorder="0"
                >
                </iframe>
              </StyledVideo>
          ))}
          {slide.codes.map((code) => (
            <StyledCode
              key={code.uuid}
              left={code.left}
              top={code.top}
              width={code.width}
              height={code.height}
            >
            <StyledPre
              fontSize={code.fontSize}
            >
              <LanguageIndicator>{detectLanguage(code.content)}</LanguageIndicator>
              <CodeContent className={`language-${detectLanguage(code.content)}`}>
                {code.content}
              </CodeContent>
            </StyledPre>
            </StyledCode>
          ))}
          <SlideNumber>{index + 1}</SlideNumber>
        </SlideContent>
      ))}
      <ArrowDiv>
        <ArrowImg src="https://img.icons8.com/?size=48&id=zQbDi5TCvdTK&format=png" alt="Previous" onClick={handlePreviousSlide} hide={currentSlideIndex === 0} />
        <ArrowImg src="https://img.icons8.com/?size=48&id=att8OkL3UbTU&format=png" alt="Next" onClick={handleNextSlide} hide={store && store[id] && store[id].slides && currentSlideIndex === Object.values(store[id].slides).length - 1} />
      </ArrowDiv>
    </SlideshowContainer>
  );
};

export default Preview;
