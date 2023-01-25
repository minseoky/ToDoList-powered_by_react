import styles from './style.module.css'
import {useState, useEffect, memo} from "react";
import Swal from "sweetalert2";

const bgImgs = ["url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2144&q=80')",
    "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
    "url('https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80')"
]
let bgIndex = Math.floor(Math.random()*3);
function Clock(props) {
    console.log('clock rerendered');
    useEffect(() => {
        clock();
    }, [])
    const clock = () => {
        setInterval(() => {
            props.setTimes([new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]);
            modDayTime();
        }, 1000);
    }
    const modDayTime = () => {
        if(0 <= props.times[0] && props.times[0] < 6){
            props.setDayTime("새벽");
        }
        else if(6 <= props.times[0] && props.times[0] < 12){
            props.setDayTime("아침");
        }
        else if(12 <= props.times[0] && props.times[0] < 18){
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
    console.log('loginform rerendered');
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
    console.log('afterlogin rerendered');
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
    console.log('github mark rerendered');
    return(
        <div className={styles.by}>
            by <a href={"https://github.com/minseoky/ToDoList-powered_by_react"} rel="noopener noreferrer" target="_blank">minseoky<img alt={"github mark"} className={styles.github} src="https://cdn-icons-png.flaticon.com/512/25/25231.png"></img></a>
        </div>
    )
}
function TodoList(){
    console.log('todolist rerendered');
    const [newlist, setNewlist] = useState("");
    const [lists, setLists] = useState(JSON.parse(localStorage.getItem("lists")));
    const [editIndex, seteditIndex] = useState(0);
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputvalue] = useState("");
    const onSubmit = (event) => {
        event.preventDefault();
        /* 새로운 목록과 checkbox check 상태를 리스트에 append */
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
        let tempArr = [...lists];
        tempArr[index][1] = !tempArr[index][1]; //set으로 바꿔야함
        setLists(tempArr);
        localStorage.setItem("lists", JSON.stringify(lists));
    }

    const delbtnOnClick = (index, e) => {
        Swal.fire({
            title: 'Are you sure to delete this?',
            text: "your list will be disappeared.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF3434',
            cancelButtonColor: '#999',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                let tempArr = [...lists];
                tempArr.splice(index, 1);
                setLists(tempArr);
                localStorage.setItem("lists", JSON.stringify(lists));
            }
        })
    }
    const editbtnOnClick = (index, e) => {
        setInputvalue(lists[index][0]); //선택한 todolist의 초기값 불러오기
        seteditIndex(index);
        setEditing(true);
    }

    const inputOnChange = (event) => {
        setInputvalue(event.target.value);
    }

    const donebtnOnClick = (index, e) => {
        let tempArr = [...lists];
        tempArr[index][0] = inputValue;
        setLists(tempArr);
        setInputvalue("");
        setEditing(false);
    }
    return(
        <div className={styles.todolist}>
            <p>To Do List</p>
            <div className={styles.todolistContainer}>
                <form onSubmit={onSubmit}>
                    <input type={"text"} className={styles.todolistInput} value={newlist} onChange={onChange} placeholder={"write your list"}/>
                    <ul className={lists.length <= 6 ? styles.innerList : styles.innerListOverflow}>
                        {lists.map((item,index) => {
                            return (
                                <div key={index}>
                                    <li className={item[1] ? styles.checked : styles.unchecked}>
                                        <div>
                                            <input
                                                type={"checkbox"}
                                                onChange={(e)=>{checkOnChange(index, e)}}
                                                checked={item[1]}
                                                className={styles.check}>
                                            </input>
                                            {editIndex === index && editing === true ?
                                                <input className={styles.editInput} type={"text"} onChange={inputOnChange} value={inputValue}></input>
                                                : item[0]
                                            }
                                            {editing == true ?
                                                null : <img alt={"delete"} className={styles.deleteBtn} onClick={(e) => delbtnOnClick(index,e)} src={"https://cdn-icons-png.flaticon.com/512/3334/3334328.png"}/>
                                            }
                                            {editIndex == index && editing == true ?
                                                <img alt={"done"} className={styles.doneBtn} onClick={(e) => donebtnOnClick(index,e)} src={"https://img.icons8.com/material-outlined/512/checked.png"}/>
                                                : <img alt={"edit"} className={styles.editBtn} onClick={(e) => editbtnOnClick(index,e)} src={"https://img.icons8.com/material-outlined/512/pencil.png"}/>
                                            }


                                        </div>
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
function ExceptClock(props){
    return(
        <div>
            {props.username == null ?
                <LoginForm dayTime={props.dayTime} username={props.username} setUsername={props.setUsername}/> :
                <AfterLogin dayTime={props.dayTime} username={props.username} setUsername={props.setUsername}/>
            }
            {props.username == null ? null : <TodoList/>}
            <GithubMark/>
        </div>
    )
}
const NewExceptClock = memo(ExceptClock);
function App() {
    const [times, setTimes] = useState([new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]);
    const [dayTime, setDayTime] = useState("");
    const [username, setUsername] = useState(null);

    useEffect(() => {
        //dayTime Default
        if(0 <= times[0] && times[0] < 6){
            setDayTime("새벽");
        }
        else if(6 <= times[0] && times[0] < 12){
            setDayTime("아침");
        }
        else if(12 <= times[0] && times[0] < 18){
            setDayTime("오후");
        }
        else{
            setDayTime("밤");
        }
        if(localStorage.getItem("username") !== null){
            setUsername(localStorage.getItem("username"));
        }
        if(localStorage.getItem("lists") == null){
            localStorage.setItem("lists", JSON.stringify([]));
        }
    },[])
    return (
        <div
            className={styles.background}
            style={{backgroundImage: bgImgs[bgIndex]}}
        >
            <Clock times={times} setTimes={setTimes} dayTime={dayTime} setDayTime={setDayTime}/>
            <NewExceptClock dayTime={dayTime} username={username} setUsername={setUsername}/>
        </div>
    );
}

export default App;