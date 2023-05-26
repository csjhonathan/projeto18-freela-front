/*eslint-disable react/prop-types, no-unused-vars*/
import {useEffect, useState} from 'react';
import * as api from '../services/api/projects_deliver.js';

export default function DeliveredProjectsList ({classId, projectId, class_name, project_name}){
	const [projects, setProjects] = useState();

	useEffect(()=>{
		getDeliveredProjects({classId, projectId});
	},[classId, projectId]);

	async function getDeliveredProjects ({classId, projectId}){
		try {
			const response = await api.listDeliveredProjects({classId, projectId});
			setProjects(response);
		} catch (error) {
			console.log(error);
		}
	}

	function changeGrade (deliver_id){
		if(window.confirm('deseja alterar esta nota?')){
			const newGrade = prompt(`
      Para qual nota deseja alterar?
        1 - Abaixo das Expectativas
        2 - Dentro das Expectativas
        3 - Acima das Expectativas
        DIGITE O NUMERO CORRESPONDENTE!
      `);
			if(isNaN(newGrade) || newGrade > 3 || newGrade < 1 || !newGrade){
				return alert('Ditite uma nota válida');
			}
			return updateDelivered(newGrade, deliver_id);
		}
		return true;
	}

	async function updateDelivered (newGrade, deliver_id){
		try {
			await api.updateDeliveredProject({gradeId: newGrade}, deliver_id);
			alert('Nota atualizada');
			return getDeliveredProjects({classId, projectId});
		} catch (error) {
			return console.log(error);
		}
	}
	if(!projects) return <div>Carregando projetos...</div>;
	return(
		<div>
			<h1>{`Projetos(s) ${project_name ? project_name : '' } ${class_name? `da Turma: ${class_name}` : 'de todas as turmas'}`}</h1>
			<ul>
				{projects.map(({deliver_id, grade, student_name})=> {
					return (
						<li 
							key={deliver_id}>{student_name} -  
							<button onClick={() => changeGrade(deliver_id)}>{grade ? grade : 'Sem Nota'}</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}