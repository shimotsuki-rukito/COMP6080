import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditTitleModal from '../components/EditTitleModal';
import Slides from '../components/Slides';
import styled from 'styled-components';

const Header = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgb(100, 100, 100);
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

const Button = styled.button`
  height: 30px;
  padding: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 5px;
`;
const EditPresentation = ({ token }) => {
  const navigate = useNavigate();
  const [store, setStore] = React.useState({});
  const [title, setTitle] = React.useState('');
  const [editedTitle, setEditedTitle] = React.useState('');
  const [Description, setDescription] = React.useState('');
  const [Thumbnail, setThumbnail] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const currentUrl = window.location.href;
  const parts = currentUrl.split('/');
  const id = parts[parts.length - 2];

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

  React.useEffect(async () => {
    if (store && store[id]) {
      setTitle(store[id].name);
      setEditedTitle(store[id].name);
      setDescription(store[id].description);
      setThumbnail(store[id].thumbnail);
    }
  }, [store, id]);

  // 开关modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const submitTitle = async (event) => {
    event.preventDefault();
    try {
      store[id].name = editedTitle;
      store[id].description = Description;
      store[id].thumbnail = Thumbnail;

      await axios.put('http://localhost:5005/store', {
        store: {
          ...store
        }
      }, {
        headers: {
          Authorization: token,
        }
      });

      closeModal();
      setStore(store);
      setTitle(editedTitle);
    } catch (err) {
      console.log(err);
    }
  };

  const deletePresentation = async () => {
    const confirmDelete = window.confirm('Are you sure?');

    if (confirmDelete) {
      delete store[id];
      await axios.put('http://localhost:5005/store', {
        store: {
          ...store
        }
      }, {
        headers: {
          Authorization: token,
        }
      });
      navigate('/dashboard');
    }
  };

  const back = () => {
    navigate('/dashboard');
  };

  if (token === '') {
    return <Navigate to="/login" />
  }

  return (
    <div>
      <Header>
        <DashboardTitle>{title}</DashboardTitle>
        <ButtonsContainer>
          <Button onClick={openModal}>Edit</Button>
          <Button onClick={deletePresentation}>Delete Presentation</Button>
          <Button onClick={back}>Back</Button>
        </ButtonsContainer>
      </Header>
      <Slides token={token} id={id}></Slides>
      {store && store[id] && <EditTitleModal ismodalopen={isModalOpen}
                      closeModal={closeModal}
                      editedTitle={editedTitle}
                      setEditedTitle={setEditedTitle}
                      submitTitle={submitTitle}
                      Description={Description}
                      setDescription={setDescription}
                      Thumbnail={Thumbnail}
                      setThumbnail={setThumbnail}
      ></EditTitleModal>}
    </div>
  );
}

export default EditPresentation;
