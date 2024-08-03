import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Link, useParams, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import TextboxModal from './TextboxModal';
import EditTextboxModal from './EditTextboxModal';
import TextBoxes from './TextBoxes';
import ImageModal from './ImageModal';
import EditImageModal from './EditImageModal';
import Images from './Images';
import VideoModal from './VideoModal';
import EditVideoModal from './EditVideoModal';
import Videos from './Videos';
import CodeModal from './CodeModal';
import EditCodeModal from './EditCodeModal';
import Codes from './Codes';
import BackgroundColorModal from './BackgroundColorModal';
import ReOrderModal from './ReOrderModal';
import HistoryModal from './HistoryModal';
import ErrorModal from './ErrorModal';

const SlideshowContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 60px);
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
`;

const SlideContent = styled.div`
  display: ${({ currentIndex, index }) => (currentIndex === index ? 'flex' : 'none')};
  position: absolute;
  top: calc(2vh + 100px);
  left: 50%;
  transform: translateX(-50%);
  width: 75vw;
  height: 75vh;
  border: 1px solid gray;
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
  animation: ${props => props.animate && (props.isVisible ? fadeIn : fadeOut)} 1s ease-in-out;
`;

const Toolbar = styled.div`
  width: 100vw;
  height: 40px;
  background-color: #f0f0f0;
  display: flex;
  overflow-y: hidden;
  margin-bottom: 1vh;
  border-bottom: 1px solid rgb(100, 100, 100);
  @media screen and (max-width: 800px) {
    overflow-x: auto;
  }
  @media screen and (min-width: 801px) {
    overflow-x: hidden;
  }
`;

const Button = styled.button`
  height: 40px;
  background-color: rgb(180, 180, 180);
  &:hover {
    background-color: rgb(120, 120, 120);
  }
  border-top: none;
  border-bottom: none;
  border-right: none;
  border-left: 1px solid rgb(100, 100, 100);
  cursor: pointer;
  font-size: 15px;
  @media screen and (max-width: 800px) {
    width: 100px;
  }
  @media screen and (min-width: 801px) {
    width: 10vw;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Slideshow = ({ token, id }) => {
  const navigate = useNavigate();
  const { slideID } = useParams();
  const slideContentRefs = useRef([]);
  const [slideContentWidth, setSlideContentWidth] = useState(0);
  const [slideContentHeight, setSlideContentHeight] = useState(0);
  const [store, setStore] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [backgroundColorModalOpen, setBackgroundColorModalOpen] = useState(false);
  const [showAddTextModal, setShowAddTextModal] = useState(false);
  const [showEditTextModal, setShowEditTextModal] = useState(false);
  const [editingTextbox, setEditingTextbox] = useState(null);
  const [ShowAddImageModal, setShowAddImageModal] = useState(false);
  const [ShowEditImageModal, setShowEditImageModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [ShowAddVideoModal, setShowAddVideoModal] = useState(false);
  const [ShowEditVideoModal, setShowEditVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [ShowAddCodeModal, setShowAddCodeModal] = useState(false);
  const [ShowEditCodeModal, setShowEditCodeModal] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [ShowReorderModal, setShowReorderModal] = useState(false);
  const [animateTransition, setAnimateTransition] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const storeRef = useRef(store);

  useEffect(() => {
    storeRef.current = store;
  }, [store]);

  useEffect(() => {
    if (store && store[id] && store[id].slides) {
      console.log(Object.values(store[id].history))
      if (Object.values(store[id].history).length === 0) {
        saveHistory();
      }
    }
  });

  const saveHistory = async () => {
    console.log('Saving history');
    const currentStore = storeRef.current;
    if (currentStore && currentStore[id] && currentStore[id].slides) {
      const newEntry = {
        state: _.cloneDeep(currentStore[id].slides),
        timestamp: new Date().toISOString()
      };

      const updatedStore = {
        ...currentStore,
        [id]: {
          ...currentStore[id],
          history: [...(currentStore[id].history || []), newEntry]
        }
      };

      await axios.put('http://localhost:5005/store', {
        store: updatedStore
      }, {
        headers: {
          Authorization: token,
        }
      });

      setStore(updatedStore);
    }
  };

  const restoreHistory = async (index) => {
    console.log(store)
    if (store && store[id] && store[id].history && index < store[id].history.length) {
      setStore(null);
      const historyState = _.cloneDeep(store[id].history[index].state);
      console.log(historyState)
      console.log(store[id].slides)
      console.log(22222)

      const newStore = _.cloneDeep(store);
      newStore[id].slides = historyState;

      await axios.put('http://localhost:5005/store', {
        store: newStore,
      }, {
        headers: {
          Authorization: token,
        }
      });

      setStore({});
      setStore(newStore);
    }

    setHistoryModalOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      saveHistory();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const slideRef = slideContentRefs.current[currentSlideIndex];
    if (slideRef && slideRef.current) {
      setSlideContentWidth(slideRef.current.offsetWidth);
      setSlideContentHeight(slideRef.current.offsetHeight);
    }
  });

  useEffect(() => {
    if (store && store[id] && store[id].slides) {
      const currentIndex = Object.keys(store[id].slides).findIndex(key => parseInt(key) === parseInt(slideID));

      if (currentIndex !== -1) {
        setCurrentSlideIndex(currentIndex);
      } else {
        navigate(`/presentation/${id}/0`);
      }
    }
  });

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

  const addNewSlide = async () => {
    const keys = Object.keys(store[id].slides);
    const lastKey = parseInt(keys[keys.length - 1]);

    store[id].slides[lastKey + 1] = {
      id: lastKey + 2,
      currentBackgroundColor: '',
      currentGradientColor: '',
      textboxes: [],
      images: [],
      videos: [],
      codes: [],
    };
    store[id].slideCount += 1;

    await axios.put('http://localhost:5005/store', {
      store: {
        ...store,
      }
    }, {
      headers: {
        Authorization: token,
      }
    });

    setStore(store);
    setCurrentSlideIndex(Object.values(store[id].slides).length);
    navigate(`/presentation/${id}/${parseInt(Object.values(store[id].slides).length) - 1}`);
  };

  const handleDeleteSlide = async () => {
    if (Object.values(store[id].slides).length === 1) {
      setErrorMessage('Cannot delete the only slide. Please delete the presentation instead.');
      setErrorModalOpen(true);
      return;
    }

    const key = Object.keys(store[id].slides)[currentSlideIndex];
    delete store[id].slides[key];
    store[id].slideCount -= 1;

    const newSlides = {};
    Object.values(store[id].slides).forEach((slide, index) => {
      const newID = index + 1;
      newSlides[index] = { ...slide, id: newID };
    });
    store[id].slides = newSlides;

    await axios.put('http://localhost:5005/store', {
      store: {
        ...store,
      }
    }, {
      headers: {
        Authorization: token,
      }
    });

    setStore(store);
    setCurrentSlideIndex(-1);
    setCurrentSlideIndex(Math.max(currentSlideIndex - 1, 0));
    navigate(`/presentation/${id}/${Math.max(currentSlideIndex - 1, 0)}`);
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < Object.values(store[id].slides).length - 1) {
      setAnimateTransition(true);
      setCurrentSlideIndex(currentSlideIndex + 1);
      navigate(`/presentation/${id}/${parseInt(slideID) + 1}`);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setAnimateTransition(true);
      setCurrentSlideIndex(currentSlideIndex - 1);
      navigate(`/presentation/${id}/${parseInt(slideID) - 1}`);
    }
  };

  useEffect(() => {
    if (animateTransition) {
      const timer = setTimeout(() => {
        setAnimateTransition(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentSlideIndex, animateTransition]);

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

  const handleAddTextbox = () => {
    setShowAddTextModal(true);
    setShowEditTextModal(false);
  };
  const handleAddImage = () => {
    setShowAddImageModal(true);
    setShowEditImageModal(false);
  };
  const handleAddVideo = () => {
    setShowAddVideoModal(true);
    setShowEditVideoModal(false);
  }
  const handleAddCode = () => {
    setShowAddCodeModal(true);
    setShowEditCodeModal(false);
  }
  const handleReOrder = () => {
    setShowReorderModal(true);
  };

  const handleSubmitTextbox = async (textboxProps) => {
    setShowAddTextModal(false);
    setShowEditTextModal(false);

    const currentSlideId = Object.keys(store[id].slides)[currentSlideIndex];

    if (editingTextbox === null) {
      const newTextboxProps = { ...textboxProps, uuid: uuidv4(), left: 0, top: 0, width: parseFloat(textboxProps.width), height: parseFloat(textboxProps.height), fontFamily: 'Arial' };
      store[id].slides[currentSlideId].textboxes.push(newTextboxProps);
    } else {
      store[id].slides[currentSlideId].textboxes = store[id].slides[currentSlideId].textboxes.map((textbox) => {
        if (textbox.uuid === editingTextbox.uuid) {
          return { ...textbox, ...textboxProps };
        }
        return textbox;
      });
    }

    await axios.put('http://localhost:5005/store', {
      store: { ...store },
    }, {
      headers: {
        Authorization: token,
      }
    });

    setStore({ ...store });
    setEditingTextbox(null);
  };

  const handleSubmitImage = async (imageProps) => {
    setShowAddImageModal(false);
    setShowEditImageModal(false);

    const currentSlideId = Object.keys(store[id].slides)[currentSlideIndex];

    if (editingImage === null) {
      const newImageProps = { ...imageProps, uuid: uuidv4(), left: 0, top: 0, width: parseFloat(imageProps.width), height: parseFloat(imageProps.height) };
      store[id].slides[currentSlideId].images.push(newImageProps);
    } else {
      store[id].slides[currentSlideId].images = store[id].slides[currentSlideId].images.map((img) => {
        if (img.uuid === editingImage.uuid) {
          return { ...img, ...imageProps };
        }
        return img;
      });
    }

    await axios.put('http://localhost:5005/store', {
      store: { ...store },
    }, {
      headers: {
        Authorization: token,
      }
    });

    setStore({ ...store });
    setEditingImage(null);
  };

  const handleSubmitVideo = async (videoProps) => {
    setShowAddVideoModal(false);
    setShowEditVideoModal(false);

    const currentSlideId = Object.keys(store[id].slides)[currentSlideIndex];

    if (editingVideo === null) {
      const newVideoProps = { ...videoProps, uuid: uuidv4(), left: 0, top: 0, width: parseFloat(videoProps.width), height: parseFloat(videoProps.height) };
      store[id].slides[currentSlideId].videos.push(newVideoProps);
    } else {
      store[id].slides[currentSlideId].videos = store[id].slides[currentSlideId].videos.map((vid) => {
        if (vid.uuid === editingVideo.uuid) {
          return { ...vid, ...videoProps };
        }
        return vid;
      });
    }

    await axios.put('http://localhost:5005/store', {
      store: { ...store },
    }, {
      headers: {
        Authorization: token,
      }
    });

    setStore({ ...store });
    setEditingVideo(null);
  };

  const handleSubmitCode = async (codeProps) => {
    setShowAddCodeModal(false);
    setShowEditCodeModal(false);

    const currentSlideId = Object.keys(store[id].slides)[currentSlideIndex];

    if (editingCode === null) {
      const newCodeProps = { ...codeProps, uuid: uuidv4(), left: 0, top: 0, width: parseFloat(codeProps.width), height: parseFloat(codeProps.height) };
      store[id].slides[currentSlideId].codes.push(newCodeProps);
    } else {
      store[id].slides[currentSlideId].codes = store[id].slides[currentSlideId].codes.map((code) => {
        if (code.uuid === editingCode.uuid) {
          return { ...code, ...codeProps };
        }
        return code;
      });
    }

    await axios.put('http://localhost:5005/store', {
      store: { ...store },
    }, {
      headers: {
        Authorization: token,
      }
    });

    setStore({ ...store });
    setEditingCode(null);
  };

  const handleApplyBackgroundSettings = async (defaultBackgroundColor, defaultGradientColor, currentBackgroundColor, currentGradientColor) => {
    const index = Object.keys(store[id].slides)[currentSlideIndex]

    store[id].defaultBackgroundColor = defaultBackgroundColor;
    store[id].defaultGradientColor = defaultGradientColor;
    store[id].slides[index].currentBackgroundColor = currentBackgroundColor;
    store[id].slides[index].currentGradientColor = currentGradientColor;

    await axios.put('http://localhost:5005/store', {
      store: { ...store },
    }, {
      headers: {
        Authorization: token,
      }
    });

    setStore({ ...store });
    setBackgroundColorModalOpen(false);
  };

  const ReOrderSlide = (items) => {
    store[id].slides = items;

    setStore({ ...store });
  }

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  return (
    <SlideshowContainer>
      <Toolbar>
        <Button onClick={handleAddTextbox}>Textbox</Button>
        <Button onClick={handleAddImage}>Image</Button>
        <Button onClick={handleAddVideo}>Video</Button>
        <Button onClick={handleAddCode}>Code</Button>
        <Button onClick={handleReOrder}>Re-arrange</Button>
        <Button onClick={() => setHistoryModalOpen(true)}>Revision History</Button>
        <Button onClick={() => setBackgroundColorModalOpen(true)}>Color Picker</Button>
        <Button>
          <StyledLink to={`/preview/${id}/${slideID}`}>
            Preview
          </StyledLink>
        </Button>
        <Button onClick={addNewSlide}>Create Slide</Button>
        <Button onClick={handleDeleteSlide}>Delete Slide</Button>
      </Toolbar>
      {store && store[id] && store[id].slides && Object.values(store[id].slides).map((slide, index) => (
        <SlideContent
          ref={slideContentRefs.current[index] || (slideContentRefs.current[index] = React.createRef())}
          key={slide.id}
          animate={animateTransition}
          isVisible={currentSlideIndex === index}
          currentIndex={currentSlideIndex}
          index={index}
          currentBackgroundColor={slide.currentBackgroundColor}
          currentGradientColor={slide.currentGradientColor}
          defaultBackgroundColor={store[id].defaultBackgroundColor}
          defaultGradientColor={store[id].defaultGradientColor}
        >
          <TextBoxes
            token={token}
            textboxes={slide.textboxes}
            currentSlideIndex={currentSlideIndex}
            presentationID={id}
            store={store}
            setStore={setStore}
            setShowAddTextModal={setShowAddTextModal}
            setShowEditTextModal={setShowEditTextModal}
            setEditingTextbox={setEditingTextbox}
            slideContentWidth={slideContentWidth}
            slideContentHeight={slideContentHeight}
          />
          <Images
            token={token}
            images={slide.images}
            currentSlideIndex={currentSlideIndex}
            presentationID={id}
            store={store}
            setStore={setStore}
            setShowAddImageModal={setShowAddImageModal}
            setShowEditImageModal={setShowEditImageModal}
            setEditingImage={setEditingImage}
            slideContentWidth={slideContentWidth}
            slideContentHeight={slideContentHeight}
          />
          <Videos
            token={token}
            videos={slide.videos}
            currentSlideIndex={currentSlideIndex}
            presentationID={id}
            store={store}
            setStore={setStore}
            setShowAddVideoModal={setShowAddVideoModal}
            setShowEditVideoModal={setShowEditVideoModal}
            setEditingVideo={setEditingVideo}
            slideContentWidth={slideContentWidth}
            slideContentHeight={slideContentHeight}
          />
          <Codes
            token={token}
            codes={slide.codes}
            currentSlideIndex={currentSlideIndex}
            presentationID={id}
            store={store}
            setStore={setStore}
            setShowAddCodeModal={setShowAddCodeModal}
            setShowEditCodeModal={setShowEditCodeModal}
            setEditingCode={setEditingCode}
            slideContentWidth={slideContentWidth}
            slideContentHeight={slideContentHeight}
          />
          <SlideNumber>{index + 1}</SlideNumber>
          <ArrowDiv>
            <ArrowImg src="https://img.icons8.com/?size=48&id=zQbDi5TCvdTK&format=png" alt="Previous" onClick={handlePreviousSlide} hide={currentSlideIndex === 0} />
            <ArrowImg src="https://img.icons8.com/?size=48&id=att8OkL3UbTU&format=png" alt="Next" onClick={handleNextSlide} hide={store && store[id] && store[id].slides && currentSlideIndex === Object.values(store[id].slides).length - 1} />
          </ArrowDiv>
        </SlideContent>
      ))}
      {backgroundColorModalOpen && (
        <BackgroundColorModal
          id={id}
          currentSlideIndex={currentSlideIndex}
          store={store}
          onClose={() => setBackgroundColorModalOpen(false)}
          onApply={handleApplyBackgroundSettings}
        />
      )}
      <TextboxModal isOpen={showAddTextModal} onSubmit={handleSubmitTextbox} onClose={() => setShowAddTextModal(false)} />
      <EditTextboxModal
          isOpen={showEditTextModal}
          textboxProps={editingTextbox}
          onSubmit={handleSubmitTextbox}
          onClose={() => setShowEditTextModal(false)}
      />
      <ImageModal isOpen={ShowAddImageModal} onSubmit={handleSubmitImage} onClose={() => setShowAddImageModal(false)} />
      <EditImageModal
          isOpen={ShowEditImageModal}
          imageProps={editingImage}
          onSubmit={handleSubmitImage}
          onClose={() => setShowEditImageModal(false)}
      />
      <VideoModal isOpen={ShowAddVideoModal} onSubmit={handleSubmitVideo} onClose={() => setShowAddVideoModal(false)} />
      <EditVideoModal
          isOpen={ShowEditVideoModal}
          videoProps={editingVideo}
          onSubmit={handleSubmitVideo}
          onClose={() => setShowEditVideoModal(false)}
      />
      <CodeModal isOpen={ShowAddCodeModal} onSubmit={handleSubmitCode} onClose={() => setShowAddCodeModal(false)} />
      <EditCodeModal
          isOpen={ShowEditCodeModal}
          codeProps={editingCode}
          onSubmit={handleSubmitCode}
          onClose={() => setShowEditCodeModal(false)}
      />
      <ReOrderModal isOpen={ShowReorderModal} store={store} id={id} onClose={() => setShowReorderModal(false)} onReorder={ReOrderSlide} />
      {store && store[id] && store[id].history && (
        <HistoryModal isOpen={historyModalOpen} history={store[id].history} onClose={() => setHistoryModalOpen(false)} onRestore={restoreHistory} />
      )}
      <ErrorModal isOpen={errorModalOpen} onClose={closeErrorModal}>
        <p>{errorMessage}</p>
      </ErrorModal>
    </SlideshowContainer>
  );
};

export default Slideshow;
