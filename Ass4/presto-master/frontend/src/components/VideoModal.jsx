import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ErrorModal from './ErrorModal';

const ModalBackground = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  padding: 20px;
  font-family: Arial;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 0px;
  right: 5px;
  color: #aaa;
  background-color: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
`;

const VideoModal = ({ isOpen, onSubmit, onClose }) => {
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  const [videoProps, setVideoProps] = useState({
    width: '',
    height: '',
    src: '',
    autoplay: false
  });

  useEffect(() => {
    if (isOpen) {
      setVideoProps({
        width: '',
        height: '',
        src: '',
        autoplay: false
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideoProps(prevProps => ({ ...prevProps, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoProps.src) {
      setErrorMessage('Please enter a video URL.');
      setErrorModalOpen(true);
      return;
    } else if (videoProps.width <= 0 || videoProps.width > 100 || videoProps.height <= 0 || videoProps.height > 100) {
      setErrorMessage('Width and height must be between 0 and 100.');
      setErrorModalOpen(true);
      return;
    }
    let videoId;
    if (videoProps.src.includes('youtube.com/watch?v=')) {
      videoId = videoProps.src.split('v=')[1].split('&')[0];
    } else if (videoProps.src.includes('youtube.com/embed/')) {
      videoId = videoProps.src.split('embed/')[1].split('?')[0];
    } else {
      setErrorMessage('Invalid URL.');
      setErrorModalOpen(true);
      return;
    }

    let embedUrl = `https://www.youtube.com/embed/${videoId}`;

    if (videoProps.autoplay) {
      embedUrl += '?autoplay=1&mute=1';
    }

    const newVideoProps = {
      ...videoProps,
      src: embedUrl
    };

    onSubmit(newVideoProps);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalBackground isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Add Video</h2>
        <form onSubmit={handleSubmit}>
        Width:
        <br />
        <input name="width" placeholder="Width" onChange={handleChange} /><br></br>
        <br />
        Height:<br />
        <input name="height" placeholder="Height" onChange={handleChange} /><br></br>
        <br />
        Video URL:<br />
        <input name="src" placeholder="Video URL" onChange={handleChange} /><br></br>
        <br />
        <label>
          Autoplay
          <input type="checkbox" name="autoplay" checked={videoProps.autoplay} onChange={e => setVideoProps(prevProps => ({ ...prevProps, autoplay: e.target.checked }))} />
        </label><br></br>
        <br />
        <button type="submit">Add Video</button>
      </form>
      </ModalContent>
      <ErrorModal isOpen={errorModalOpen} onClose={closeErrorModal}>
        <p>{errorMessage}</p>
      </ErrorModal>
    </ModalBackground>
  );
};

export default VideoModal;
