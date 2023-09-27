import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [todoList, setTodoList] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTodo, setSelectedTodo] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isAddLoading, setIsAddLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const resetFields = () => {
        setTitle('');
        setDescription('');
        setErrors({});
        setSelectedTodo(null);
    };


    const validate = () => {
        try {

            const error = {};
            if (!title) {
                error.title = 'Title is required!'
            }
            if (!description) {
                error.description = 'Description is required!'
            }
            setErrors(error);
            console.log(error);
            return error;
        } catch (error) {
            console.log(error);
        }
    }

    const fetchTodos = async () => {
        try {
            const config = {
                method: 'get',
                url: 'http://localhost:9990/getTodos'
            };

            const response = await axios(config);
            console.log(response.data.data);
            setTodoList(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const createTodo = async () => {
        try {
            setIsAddLoading(true);
            const error = await validate();

            if (Object.keys(error).length > 0) {
                setIsAddLoading(false);
                return false;
            }

            const config = {
                method: 'post',
                url: 'http://localhost:9990/createTodo',
                data: {
                    title: title,
                    description: description
                }
            }
            const response = await axios(config);
            console.log(response);
            resetFields();
            await fetchTodos();
            setIsAddLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const editTodo = async () => {
        try {

            setIsAddLoading(true);
            const config = {
                method: 'post',
                url: 'http://localhost:9990/editTodo',
                data: {
                    title: title,
                    description: description,
                    _id : selectedTodo?._id
                }
            }
            const response = await axios(config);
            console.log(response);
            await fetchTodos();
            resetFields();
            setIsAddLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteTodo = async (item) => {
        try {
            setIsDeleteLoading(true);
            const config = {
                method: 'post',
                url: 'http://localhost:9990/deleteTodo',
                data: {
                    _id : item?._id
                }
            }
            const response = await axios(config);
            console.log(response);
            await fetchTodos();
            setIsDeleteLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            console.log('first')
            if (selectedTodo) {
            console.log('second')
                
                await editTodo();
            }
            else {
            console.log('third')

                await createTodo();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleCompleteTodo = async (e, item) => {
        try {
            console.log(e.target.value);
            setIsDeleteLoading(true);
            const config = {
                method : 'post',
                url : 'http://localhost:9990/completedOrNot',
                data : {
                    id : item?._id,
                    completed : !(item?.completed)
                }
            }
            const response = await axios(config);
            console.log(response);
            await fetchTodos();
            setIsDeleteLoading(false);

        } catch (error) {
            console.log(error);
            setIsDeleteLoading(false);
        }
    }

    useEffect(() => {
        fetchTodos();
    }, [])

    useEffect(() => {
        if (selectedTodo) {
            setTitle(selectedTodo.title);
            setDescription(selectedTodo.description);
        }
    }, [selectedTodo])

    return (
        <div className='container my-5'>
            <h1>TODO Application</h1>

            <div className='border border-dark-3 rounded p-5 my-3'>
                <form onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input class="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        {
                            errors.title && <p className='text-danger'>{errors.title}</p>
                        }
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <input class="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        {
                            errors.description && <p className='text-danger'>{errors.description}</p>
                        }
                    </div>
                    <button type="submit" class="btn btn-primary my-1" disabled={isAddLoading}>
                        {
                            isAddLoading ?
                                'Loading .....'
                                :
                                'Submit'
                        }
                    </button>
                </form>
            </div>

            {
                isLoading ?
                    <p>Loading .....</p>
                    :

                    todoList.length === 0 ? 
                    <h4>No Records found...</h4>
                    :
                    <table className='table border table-bordered'>
                        <thead>
                            <tr>
                                <th>Serial No. </th>
                                <th>Title</th>
                                <th>Description</th>
                                <th className='text-center'>Completed ?</th>
                                <th className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                todoList.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item?.title}</td>
                                            <td>{item?.description}</td>
                                            <td className='text-center'>
                                                <input 
                                                    type='checkbox' 
                                                    checked={item?.completed} 
                                                    onChange={(e) => handleCompleteTodo(e, item)} 
                                                />
                                            </td>
                                            <td className='text-center'>
                                                <button className='btn btn-success mx-1'
                                                    onClick={
                                                        () => {
                                                            setSelectedTodo(item);
                                                        }
                                                    }>Edit</button>
                                                <button 
                                                    className='btn btn-danger mx-1' 
                                                    onClick={() => {deleteTodo(item)}}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
            }
        </div>
    )
}


export default App;

// todo-list (array) : goal
//step 1 : state variable to store the todo list(array)
//[, ]
// { title : 'title1', description : 'description1'}
// { title : 'title2', description : 'description2'}
//step 2 : Display the todo list(array)

//step 3 : Make a form to add title and description.
//step 4 : edit a selectedTodo list.
//step 5 : Integrate Apis.