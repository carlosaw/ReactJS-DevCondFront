import React, { useState, useEffect } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CDataTable,
  CButtonGroup,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormGroup,
  CLabel,
  CInput,
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import useApi from '../services/api';
// eslint-disable-next-line
export default () => {
  const api = useApi();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTitleField, setModalTitleField] = useState('');
  const [modalFileField, setModalFileField] = useState('');
  const [modalId, setModalId] = useState('');

  // Monta as colunas da lista.
  const fields = [
    {label: 'Título', key: 'title'},
    {label: 'Ações', key: 'actions', _style:{width: '1px'}}
  ];

  useEffect(() => {
    getList();
  // eslint-disable-next-line
  }, []);

  const getList = async () => {
    setLoading(true);
    const result = await api.getDocuments();
    setLoading(false);
    if(result.error === '') {
      setList(result.list);
    } else {
      alert(result.error);
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleEditButton = (id) => {
    let index = list.findIndex(v=>v.id===id);
    setModalId(list[index]['id']);
    setModalTitleField(list[index]['title']);
    setShowModal(true);
  }

  const handleRemoveButton = async (id) => {
    if(window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.removeDocument(id);
      if(result.error === '') {
        getList();
      } else {
        alert(result.error);
      }
    }
  }

  const handleNewButton = () => {
    setModalId('');
    setModalTitleField('');
    setModalFileField('');
    setShowModal(true);
  }

  const handleModalSave = async () => {
    if(modalTitleField) {
      setModalLoading(true);
      let result;
      let data = {
        title: modalTitleField
      };

      if(modalId === '') {
        if(modalFileField) {
          data.file = modalFileField;
          result = await api.addDocument(data);
        } else {
          alert("Selecione o arquivo!");
          setModalLoading(false);
          return;
        }        
      } else {
        if(modalFileField) {
          data.file = modalFileField;
        }
        result = await api.updateDocument(modalId, data);
      }

      setModalLoading(false);
      if(result.error === '') {
        setShowModal(false);
        getList();
      } else {
        alert(result.error);
      }
    } else {
      alert("Preencha os campos!");
    }
  }

  const handleDownloadButton = (id) => {
    let index = list.findIndex(v=>v.id===id);
    window.open(list[index]['fileurl']);
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Documentos</h2>
          <CCard>
            <CCardHeader>
              <CButton color="primary" onClick={handleNewButton}>
                <CIcon name='cil-check' /> Novo Documento
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={list}
                fields={fields}
                loading={loading}
                noItemsViewSlot=" "
                hover
                striped
                bordered
                pagination
                itemsPerPage={2}
                scopedSlots={{
                  'actions': (item)=>(
                    <td>
                      <CButtonGroup>
                        <CButton color='success' onClick={()=>handleDownloadButton(item.id)}>
                          <CIcon name="cil-cloud-download" />
                        </CButton>
                        <CButton color="info" onClick={()=>handleEditButton(item.id)}>Editar</CButton>
                        <CButton color="danger" onClick={()=>handleRemoveButton(item.id)}>Excluir</CButton>
                      </CButtonGroup>
                    </td>
                  )
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal show={showModal} onClose={handleCloseModal}>
        <CModalHeader closeButton>{modalId === '' ? 'Novo' : 'Editar' } Documento</CModalHeader>

        <CModalBody>          
          <CFormGroup>
            <CLabel htmlFor="modal-title">Título do documento</CLabel>
            <CInput 
              type="text"
              id="modal-title"
              placeholder="Digite um título para o documento"
              value={modalTitleField}
              onChange={e=>setModalTitleField(e.target.value)}
              disabled={modalLoading}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="modal-file">Arquivo (pdf)</CLabel>
            <CInput 
              type="file"
              id='modal-file'
              name='file'
              placeholder='Escolha um arquivo'
              onChange={e=>setModalFileField(e.target.files[0])}
            />
          </CFormGroup>
        </CModalBody>

        <CModalFooter>
          <CButton 
            color="primary" 
            onClick={handleModalSave}
            disabled={modalLoading}
          >
            {modalLoading ? 'Carregando...' : 'Salvar'}
          </CButton>
          <CButton 
            color="secondary" 
            onClick={handleCloseModal}
            disabled={modalLoading}
          >Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}