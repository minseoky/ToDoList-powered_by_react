import styles from './style.module.css'
import {useState, useEffect} from "react";
import Swal from "sweetalert2";

const bgImgs = ["url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2144&q=80')",
    "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
    "url('https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80')"
    ]
let bgIndex = Math.floor(Math.random()*3);
function Clock(props) {
    useEffect(() => {
        clock();
        modDayTime();
        })
    const clock = () => {
        setInterval(() => {
            props.setTimes([new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]);
            clock();
            modDayTime();
        }, 1000);
    }
    const modDayTime = () => {
        if(0 < props.times[0] && props.times[0] <= 6){
            props.setDayTime("새벽");
        }
        else if(6 < props.times[0] && props.times[0] <= 12){
            props.setDayTime("아침");
        }
        else if(12 < props.times[0] && props.times[0] <= 18){
            props.setDayTime("오후");
        }
        else{
            props.setDayTime("밤");
        }
    }


    return(
        <div className={styles.clock}>
            {String(props.times[0]).padStart(2,'0')}:{String(props.times[1]).padStart(2,'0')}:{String(props.times[2]).padStart(2,'0')}
        </div>
    )
}
function LoginForm(props) {
    const [name, setName] = useState("");
    const onChange = (event) => {
        setName(event.target.value);
    }
    const loginSubmit = (event) => {
        if(name.length < 6){
            event.preventDefault();
            Swal.fire({icon:'success',title:'Welcome.',text:name});
            localStorage.setItem("username", name);
            props.setUsername(name);

        }

        else{
            event.preventDefault();
            Swal.fire({icon:'error',title:'Your name is too long.',text:"Try again within 5 characters."});
            setName("");
        }
    }
    return(
        <div className={styles.mainContainer}>
            <form onSubmit={loginSubmit}>
                <span className={styles.maintext}>좋은 {props.dayTime}입니다. </span>
                <input className={styles.maintextInput} type={"text"} value={name} onChange={onChange} placeholder={"Input your name"}></input>
            </form>
        </div>
    )
}
function AfterLogin(props) {
    const logout = () => {
        localStorage.removeItem("username");
        Swal.fire({
            title: 'Are you sure to log out?',
            text: "All of your data will be deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF3434',
            cancelButtonColor: '#999',
            confirmButtonText: 'Yes, Log out'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Log out',
                    'Your data has been deleted.',
                    'success'
                )
                localStorage.setItem("lists", JSON.stringify([]));
                props.setUsername(null);
            }
        })
    }
    return(
        <div className={styles.mainContainer}>
            <div className={styles.maintext}>
                좋은 {props.dayTime}입니다. {props.username}
                <button className={styles.logoutBtn} onClick={logout}>Log out</button>
            </div>
        </div>
    )
}
function GithubMark() {
    return(
        <div className={styles.by}>
            by <a href={"https://github.com/minseoky/ToDoList-powered_by_react"} rel="noopener noreferrer" target="_blank">minseoky<img alt={"github mark"} className={styles.github} src="https://cdn-icons-png.flaticon.com/512/25/25231.png"></img></a>
        </div>
    )
}
function TodoList(){
    const [newlist, setNewlist] = useState("");
    const [lists, setLists] = useState(JSON.parse(localStorage.getItem("lists")));
    const onSubmit = (event) => {
        event.preventDefault();
        /* 새로운 목록와 checkbox check 상태를 리스트에 append */
        setLists((prev) => [...prev, [newlist, false]])
        setNewlist("");
    }
    useEffect(() => {
        localStorage.setItem("lists", JSON.stringify(lists));
    }, [lists])
    const onChange = (event) => {
        setNewlist(event.target.value);
    }
    const checkOnChange = (index, event) => {
        lists[index][1] = !lists[index][1];
        localStorage.setItem("lists", JSON.stringify(lists));
    }
    const btnOnClick = (index, e) => {
        lists.splice(index, 1);
        localStorage.setItem("lists", JSON.stringify(lists));
    }
    return(
        <div className={styles.todolist}>
            <p>To Do List</p>
            <div className={styles.todolistContainer}>
                <form onSubmit={onSubmit}>
                    <input type={"text"} className={styles.todolistInput} value={newlist} onChange={onChange} placeholder={"write your list"}/>
                    <ul className={styles.innerList}>
                        {lists.map((item,index) => {
                            return (
                                <div key={index}>
                                    <li className={item[1] ? styles.checked : styles.unchecked}>
                                        <input type={"checkbox"} onChange={(e)=>{checkOnChange(index, e)}} checked={item[1]} className={styles.check}></input>
                                        {item[0]}
                                        <img className={styles.deleteBtn} onClick={(e) => btnOnClick(index,e)} src={"https://cdn-icons-png.flaticon.com/512/3334/3334328.png"}></img>
                                    </li>
                                </div>
                            )
                        })}
                    </ul>
                </form>
            </div>
        </div>
    )
}
function App() {
    const [times, setTimes] = useState([new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]);
    const [dayTime, setDayTime] = useState("");
    const [username, setUsername] = useState(null);
    useEffect(() => {
        if(localStorage.getItem("username") !== null){
            setUsername(localStorage.getItem("username"));
        }
        if(localStorage.getItem("lists") == null){
            localStorage.setItem("lists", JSON.stringify([]));
        }
        else{

        }
        },[])

    return (
        <div
            className={styles.background}
            style={{backgroundImage: bgImgs[bgIndex]}}
        >
            <Clock times={times} setTimes={setTimes} dayTime={dayTime} setDayTime={setDayTime}/>
            {username == null ? <LoginForm dayTime={dayTime} username={username} setUsername={setUsername}/> : <AfterLogin dayTime={dayTime} username={username} setUsername={setUsername}/>}
            {username == null ? null : <TodoList/>}
            <GithubMark/>
        </div>
    );
}

export default App;
