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
        },[])
    const clock = () => {
        setInterval(() => {
            props.setTimes([new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]);
            clock();
        }, 1000);
    }
    useEffect(() => {
        if(props.dayTime != ""){
            modDayTime();
        }
    }, [props.times[0]])
    const modDayTime = () => {
        if(0 < props.times[0] && props.times[0] <= 6){
            props.setDayTime("새벽");
        }
        else if(6< props.times[0] && props.times[0] <= 12){
            props.setDayTime("아침");
        }
        else if(12< props.times[0] && props.times[0] <= 18){
            props.setDayTime("저녁");
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
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Log out!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Log out',
                    'Your data has been deleted.',
                    'success'
                )
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
            by <a href={"https://github.com/minseoky"} target="_blank">minseoky<img className={styles.github} src="https://cdn-icons-png.flaticon.com/512/25/25231.png"></img></a>
        </div>
    )
}
function TodoList(){
    const [newlist, setNewlist] = useState("");
    const [lists, setLists] = useState([]);
    const onSubmit = (event) => {
        event.preventDefault();
        setLists((prev) => [...prev, newlist])
        setNewlist("");
    }
    const onChange = (event) => {
        setNewlist(event.target.value);
    }
    return(
        <div className={styles.todolist}>
            <p>To Do List</p>
            <div className={styles.todolistContainer}>
                <form onSubmit={onSubmit}>
                    <input type={"text"} className={styles.todolistInput} value={newlist} onChange={onChange} placeholder={"write your list"}/>
                    <ul className={styles.innerList}>
                        {lists.map((item) => {
                            return (
                                <li key={item}><input type={"checkbox"} className={styles.check}/> {item}</li>
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
        if(localStorage.getItem("username") !== null){}
            setUsername(localStorage.getItem("username"));
        }
    ,[])

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
