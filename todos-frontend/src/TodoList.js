import React, { Component } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm'

const APIURL = '/api/todos/';


class TodoList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: []
        }
        this.addTodo=this.addTodo.bind(this);
      
    }
    componentDidMount() {
        this.loadTodos();
    }

    //GET REQUEST LOAD TODOS
    loadTodos() {
        fetch(APIURL)
            .then(resp => {
                if (!resp.ok) {
                    if (resp.status >= 400 && resp.status < 500) {
                        return resp.json().then(data => {
                            let err = { errorMessage: data.message };
                            throw err;
                        })
                    } else {
                        let err = { errorMessage: "Please Try  again later" };
                        throw err
                    }
                }
                return resp.json()
            })
            .then(todos => this.setState({ todos }));
    }

    //POST REQUEST ADD TODO
    addTodo(val){
      
        fetch(APIURL,{
            method:'POST',
            headers: new Headers({
                'Content-Type':'application/json'
            }),
            body:JSON.stringify({name:val})
        })
        .then(resp => {
            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = { errorMessage: data.message };
                        throw err;
                    })
                } else {
                    let err = { errorMessage: "Please Try  again later" };
                    throw err
                }
            }
            return resp.json()
        })
        .then(newTodo  => this.setState({ todos:[...this.state.todos,newTodo] }));
        
    }
    toggleTodo(todo){
        const updateUrl=APIURL+todo._id
        fetch(updateUrl,{
            method:'put',
            headers: new Headers({
                'Content-Type':'application/json'
            }),
            body:JSON.stringify({completed:!todo.completed})
        })
        .then(resp => {
            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = { errorMessage: data.message };
                        throw err;
                    })
                } else {
                    let err = { errorMessage: "Please Try  again later" };
                    throw err
                }
            }
            return resp.json()
        })
        .then(updatedTodo=>{
            const todos=this.state.todos.map(todo=>(
                (todo._id===updatedTodo._id)?
                {...todo,completed:!todo.completed}:todo
                ))
            this.setState({todos});
        })
        
    }

    // DELETE REQUEST

    deleteTodo(id){
        const deleteUrl=APIURL+id
        fetch(deleteUrl,{
            method:'delete',
           
        })
        .then(resp => {
            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = { errorMessage: data.message };
                        throw err;
                    })
                } else {
                    let err = { errorMessage: "Please Try  again later" };
                    throw err
                }
            }
            return resp.json()
        })
        .then(()=>{
            const todos=this.state.todos.filter(todo=>todo._id!==id);
            this.setState({todos});
        })
        
    
    }

    render() {
       let {todos}=this.state
      let output= todos.map(todo=>{
          return(
              <TodoItem key={todo._id} {...todo}
              onToggle={this.toggleTodo.bind(this,todo)} 
              onDelete={this.deleteTodo.bind(this,todo._id)}
              />
          )
      })
        return (
            <div>
                <TodoForm addTodo={this.addTodo} />
                <ul>
                {output}
                </ul>
            </div>
        )
    }
}
export default TodoList;