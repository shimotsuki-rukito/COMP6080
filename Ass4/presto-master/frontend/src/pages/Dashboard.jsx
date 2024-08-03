import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import Modal from '../components/Modal';
import NewPresentationButton from '../components/NewPresentationButton';
import PresentationsList from '../components/PresentationsList';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgb(100, 100, 100);
  margin-bottom: 10px;
  font-family: Arial;
`;

const DashboardTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 30px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Dashboard = ({ token, setTokenFunction }) => {
  const [store, setStore] = React.useState({});
  const [presentationIndex, setPresentationIndex] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [PresentationName, setPresentationName] = React.useState('');
  const [Description, setDescription] = React.useState('');
  const [Thumbnail, setThumbnail] = React.useState('');

  React.useEffect(async () => {
    await axios.get('http://localhost:5005/store', {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      setStore(response.data.store);
    });
  }, []);

  React.useEffect(async () => {
    if (store) {
      setPresentationIndex(Object.keys(store).length > 0 ? parseInt(Object.keys(store)[Object.keys(store).length - 1]) + 1 : 0);
    }
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPresentationName('');
    setDescription('');
    setThumbnail('');
  };

  const createPresentation = async () => {
    try {
      const newPresentation = {
        id: presentationIndex,
        name: PresentationName,
        description: Description,
        thumbnail: Thumbnail,
        slideCount: 1,
        defaultBackgroundColor: '',
        defaultGradientColor: '',
        slides: {
          0: {
            id: 1,
            currentBackgroundColor: '',
            currentGradientColor: '',
            textboxes: [],
            images: [],
            videos: [],
            codes: []
          }
        },
        history: []
      };

      await axios.put('http://localhost:5005/store', {
        store: {
          ...store,
          [presentationIndex]: newPresentation
        }
      }, {
        headers: {
          Authorization: token,
        }
      })
      closeModal();

      setStore(prevStore => ({
        ...prevStore,
        [presentationIndex]: newPresentation
      }));
    } catch (err) {
      console.log(err);
    }
  };

  if (token === '') {
    return <Navigate to="/login" />
  }

  return (
    <div>
      <Header>
        <DashboardTitle>Dashboard</DashboardTitle>
        <ButtonsContainer>
          <NewPresentationButton onClick={openModal} />
          <LogoutButton token={token} setToken={setTokenFunction} /><br />
        </ButtonsContainer>
      </Header>
      <Modal ismodalopen={isModalOpen}
              closeModal={closeModal}
              PresentationName={PresentationName}
              setPresentationName={setPresentationName}
              createPresentation={createPresentation}
              Description={Description}
              setDescription={setDescription}
              Thumbnail={Thumbnail}
              setThumbnail={setThumbnail}
      ></Modal>
      <PresentationsList store={store}></PresentationsList>
    </div>
  );
}

export default Dashboard;
