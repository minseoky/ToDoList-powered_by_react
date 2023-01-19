import { useState, useEffect } from 'react';
import './body.css'

let randomIndex;
const imgs = [
    'url("https://images.wallpaperscraft.com/image/single/buildings_sea_embankment_669650_3840x2400.jpg")',
    'url("https://images.wallpaperscraft.com/image/single/buildings_sea_coast_351843_3840x2400.jpg")',
    'url("https://images.wallpaperscraft.com/image/single/buildings_houses_coast_267033_3840x2400.jpg")'
];
randomIndex = Math.floor(Math.random() * imgs.length);

function App() {
    const [todo,setTodo] = useState("");
    const [todos,setTodos] = useState([]);
    const [dones,setDones] = useState([]);
    const [btnColor, setBtnColor] = useState("tomato");
    useEffect(() => {
        document.querySelector("title").innerHTML = "To Do List";
    }, [])
    const onChange = (e) => {
        setTodo(e.target.value);
    }
    const onSubmit = (event) => {
        event.preventDefault();
        if(todo === ""){
            return;
        }
        setTodo("");
        setTodos((prev) => [...prev,todo]);
    }
    const onMouseEnter = () => {
        setBtnColor("orange");
    }
    const onMouseLeave = () => {
        setBtnColor("tomato");
    }
    const todoClick = (event) => {
        console.log(event.target.innerHTML);
        const target = event.target.innerHTML;
        const tempArr = [];
        let s = 0;
        for(let i = 0 ; i < todos.length ; i++){
            if(todos[i] != target){
                tempArr[s] = todos[i];
                s++;
            }
            else{
                setDones((prev) => [...prev, todos[i]]);
            }
        }
        setTodos(tempArr);
    }
    const doneClick = (event) => {
        console.log(event.target.innerHTML);
        const target = event.target.innerHTML;
        const tempArr = [];
        let s = 0;
        for(let i = 0 ; i < dones.length ; i++){
            if(dones[i] != target){
                tempArr[s] = dones[i];
                s++;
            }
            else{
                setTodos((prev) => [...prev, dones[i]]);
            }
        }
        setDones(tempArr);
    }
    useEffect(() => {
        console.log(todos);
    },[todos])
    return (
        <div className={'main-container'} style={{backgroundImage:imgs[randomIndex]}}>
            <h1 className={'title'}>My To Dos ({todos.length})</h1>
            <div className={'inputDiv'}>
                <form onSubmit={onSubmit}>
                    <input className={'input'} value={todo} onChange={onChange} type="text" placeholder={"write your to do..."}/>
                    <button onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{backgroundColor: btnColor}} className={'btn'}>submit</button>
                </form>
            </div>

            <div className={'list'} style={{opacity: todos.length == 0 ? 0 : 1}}>
                <div style={{textAlign : "center"}}>WHAT TO DO</div>
                <ul>
                    {todos.map( (item) => {
                        return (
                            <li onClick={todoClick} key={item}>{item}</li>
                        );
                    })}
                </ul>
            </div>

            <div className={'list2'} style={{opacity: dones.length == 0 ? 0 : 1}}>
                <div style={{textAlign : "center"}}>COMPLETED</div>
                <ul style={{textDecoration : "line-through"}}>
                    {dones.map( (item) => {
                        return (
                            <li onClick={doneClick} key={item}>{item}</li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default App;
