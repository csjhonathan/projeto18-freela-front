/*eslint-disable no-unused-vars */

import {useEffect, useState, useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import * as api from '../services/api/students.js';
import HeaderContext from '../context/headerContext.js';
import InputMask from 'react-input-mask';
import {useForm} from 'react-hook-form';
import {EditButton,FormTitle, EditStudentForm, FormContainer, InputContainer} from '../styles/editStudandPage.js/styles.js';


export default function EditStudentPage (){

	const {register, setValue, handleSubmit} = useForm();
	const {studentId} = useParams();
	const[student, setStudent] = useState();
	const{setHeader} = useContext(HeaderContext);
	const navigate = useNavigate();
	const[currentRegistration, setCurrentRegistration] = useState(); 

	useEffect(()=>{
		getStudent(studentId);
		setHeader(
			<>
				<button onClick={()=> navigate(`/registration/update/${currentRegistration}/${studentId}`)}>Alterar Matrícula do Aluno</button>
				<button onClick={()=> navigate(-1)}>Voltar</button>
			</>
		);
	}, [currentRegistration]);

	async function getStudent (studentId){
		const hash = {
			name: true,
			cpf: true,
			email: true,
			classId: true,
			photo: true
		};
		try {
			const response = await api.getStudentById(studentId);
			
			for(const props in response){
				if(hash[props]){
					setValue(props, response[props]);
				}				
			}
			setCurrentRegistration(response.currentRegistration?.id);
			return setStudent(response);
		} catch (error) {
			return alert('Houve um erro inesperado!');
		}
    
	}

	async function editStudent (data){

		if(!data.photo) delete data.photo;
		const formatedCpf = data.cpf.replace(/[.-]/g, '');
		data.cpf = formatedCpf;
		
		try {			
			const response = await api.update(data, studentId);
			alert(response.message);
			return navigate(-1);
		} catch (error) {
			if(error.status===409 || error.status===422){
				return alert(error.data.message);
			}
			return alert('Houve um erro inesperado!');
		}

	}

	if(!student ) return <div>carregando dados...</div>;
	
	return(
		<FormContainer>
			<FormTitle>Edição de Aluno</FormTitle>
			<EditStudentForm onSubmit={handleSubmit(editStudent)}>
				<InputContainer>
					<label htmlFor="name">Nome*: </label>
					<input
						type='text'
						name='name'
						required
						{...register('name')}
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="cpf">CPF*: </label>
					<InputMask
						mask={'999.999.999-99'}
						type='text'
						name='cpf'
						required
						{...register('cpf')}
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="">E-mail*: </label>
					<input
						type='email'
						name='email'
						required
						{...register('email')}
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Foto: </label>
					<input
						type='text'
						name='photo'
						{...register('photo')}
					/>
				</InputContainer>
				<EditButton>Editar Aluno</EditButton>
			</EditStudentForm>
		</FormContainer>
	);
}