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

  const [modalId, setModalId] = useState('');
  const [modalNameField, setModalNameField] = useState('');
  const [modalEmailField, setModalEmailField] = useState('');
  const [modalCpfField, setModalCpfField] = useState('');
  const [modalPass1Field, setModalPass1Field] = useState('');
  const [modalPass2Field, setModalPass2Field] = useState('');

  // Monta as colunas da lista.
  const fields = [
    {label: 'Nome', key: 'name'},
    {label: 'Email', key: 'email'},
    {label: 'CPF', key: 'cpf'},
    {label: 'Ações', key: 'actions', _style:{width: '1px'}, sorter: false, filter: false}
  ];

  useEffect(() => {
    getList();
  // eslint-disable-next-line
  }, []);

  const getList = async () => {
    setLoading(true);
    const result = await api.getUsers();
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
    //console.log("INDEX", index);
    let index = list.findIndex(v=>v.id===id);
    setModalId(list[index]['id']);
    setModalNameField(list[index]['name']);
    setModalEmailField(list[index]['email']);
    setModalCpfField(list[index]['cpf']);
    setModalPass1Field('');
    setModalPass2Field('');
    setShowModal(true);
  }

  const handleNewButton = () => {
    setModalId('');
    setModalNameField('');
    setModalEmailField('');
    setModalCpfField('');
    setModalPass1Field('');
    setModalPass2Field('');
    setShowModal(true);
  }

  const handleRemoveButton = async (id) => {
    if(window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.removeUser(id);
      if(result.error === '') {
        getList();
      } else {
        alert(result.error);
      }
    }
  }

  const handleModalSave = async () => {
    if(modalNameField && modalEmailField && modalCpfField) {
      setModalLoading(true);
      let result;
      let data = {
        name: modalNameField,
        email: modalEmailField,
        cpf: modalCpfField,
      };
      if(modalPass1Field) {
        if(modalPass1Field === modalPass2Field) {
          data.password = modalPass1Field;
        } else {
          alert("Senhas não batem!");
          setModalLoading(false);
        }
      }
      if(modalId === '') {
        result = await api.addUser(data);
      } else {
        result = await api.updateUser(modalId, data);        
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

  return (
    <>
      <CRow>
        <CCol>
          <h2>Usuários</h2>
          <CCard>
            <CCardHeader>
              <CButton 
                color="primary" 
                onClick={handleNewButton}
              >
                <CIcon name='cil-check' /> Novo Usuário
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={list}
                fields={fields}
                loading={loading}
                noItemsViewSlot=" "
                columnFilter
                sorter
                hover
                striped
                bordered
                pagination
                itemsPerPage={9}
                scopedSlots={{
                  'actions': (item, index)=>(
                    <td>
                      <CButtonGroup>
                        <CButton 
                          color="info" 
                          onClick={()=>handleEditButton(item.id)}
                        >Editar</CButton>
                        <CButton 
                          color="danger" 
                          onClick={()=>handleRemoveButton(item.id)}
                        >Excluir</CButton>
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
        <CModalHeader closeButton>{modalId === '' ? 'Novo' : 'Editar' } Usuário</CModalHeader>

        <CModalBody>  

          <CFormGroup>
            <CLabel htmlFor="modal-name">Nome do usuário</CLabel>
            <CInput 
              type="text"
              id="modal-name"
              value={modalNameField}
              onChange={e=>setModalNameField(e.target.value)}
              disabled={modalLoading}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="modal-email">E-mail do usuário</CLabel>
            <CInput 
              type="email"
              id="modal-email"
              value={modalEmailField}
              onChange={e=>setModalEmailField(e.target.value)}
              disabled={modalLoading}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="modal-cpf">CPF do usuário</CLabel>
            <CInput 
              type="text"
              id="modal-cpf"
              placeholder='(Somente números)'
              value={modalCpfField}
              onChange={e=>setModalCpfField(e.target.value)}
              disabled={modalLoading}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="modal-pass1">Nova Senha</CLabel>
            <CInput 
              type="password"
              id="modal-pass1"
              placeholder='Digite uma nova senha para o usuário'
              value={modalPass1Field}
              onChange={e=>setModalPass1Field(e.target.value)}
              disabled={modalLoading}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="modal-pass2">Nova senha (Confirmação)</CLabel>
            <CInput 
              type="password"
              id="modal-pass2"
              placeholder='Confirme a nova senha para o usuário'
              value={modalPass2Field}
              onChange={e=>setModalPass2Field(e.target.value)}
              disabled={modalLoading}
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