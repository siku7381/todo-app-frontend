import React, { useState, useEffect } from 'react';

const App = () => {
    const [todoList, setTodoList] = useState([{ title: 'title1', description: 'description1' }, { title: 'title2', description: 'description2' }]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTodo, setSelectedTodo] = useState();
    const [i, setI] = useState();

    const resetFields = () => {
        setTitle('');
        setDescription('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTodoList = [...todoList]; // array destructuring : break into individual element

        if (selectedTodo) {
            newTodoList[i].title = title;
            newTodoList[i].description = description;
            setTodoList(newTodoList);
        }
        else {
            newTodoList.push({ title: title, description: description });
            setTodoList(newTodoList);
        }
        resetFields();
    }

    useEffect(() => {
        if (selectedTodo) {
            setTitle(selectedTodo.title);
            setDescription(selectedTodo.description);
        }
    }, [selectedTodo]) //dependency array : if empty then it will render the app for the first time only , if any value present inside then i will render the app again and again when the value changes.

    return (
        <div className='container my-5'>
            <h1>TODO Application</h1>

            <div className='border border-dark-3 rounded p-5 my-3'>
                <div onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input class="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <input class="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <button type="submit" class="btn btn-primary my-1">Submit</button>
                </div>
            </div>

            <table className='table border table-bordered'>
                <thead>
                    <tr>
                        <th>Serial No. </th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        todoList.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <button className='btn btn-success mx-1'
                                            onClick={
                                                () => {
                                                    setSelectedTodo(item);
                                                    setI(index);
                                                }
                                            }>Edit</button>
                                        <button className='btn btn-danger mx-1'>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
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